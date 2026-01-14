using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Entities;
using server.Foundation.Result;
using server.Models.InternshipDocument;
using server.Models.Mail;

namespace server.Services;

public class InternshipDocumentService(
    ApplicationDbContext dbContext,
    IS3Service s3Service,
    IMailService mailService
) : IInternshipDocumentService
{
    private const int MaxSupportingDocs = 3;

    public async Task<Result<InternshipDocumentsStatusResDto>> GetDocumentsStatusAsync(Guid internshipId, Guid userId)
    {
        var internship = await dbContext.Internships
            .Include(i => i.Documents)
            .Include(i => i.Student)
            .Include(i => i.CompanyRepresentative)
            .FirstOrDefaultAsync(i => i.Id == internshipId);

        if (internship == null)
        {
            return Result<InternshipDocumentsStatusResDto>.Failure(Error.NotFound);
        }

        // Check access - student, company rep, or internship handler
        var user = await dbContext.Users.FindAsync(userId);
        if (user == null)
        {
            return Result<InternshipDocumentsStatusResDto>.Failure(Error.Unauthorized);
        }

        var hasAccess = user.Role == ERole.InternshipHandler ||
                        internship.StudentId == userId ||
                        internship.CompanyRepresentativeId == userId;

        if (!hasAccess)
        {
            return Result<InternshipDocumentsStatusResDto>.Failure(Error.Unauthorized);
        }

        var result = new InternshipDocumentsStatusResDto
        {
            InternshipType = internship.Type,
            IsSupportingDocsApprovedByCompany = internship.IsSupportingDocsApprovedByCompany,
            IsReportApprovedByCompany = internship.IsReportApprovedByCompany,
            StudentSupportingDocs = internship.Documents
                .Where(d => d.Slot == EDocumentSlot.Supporting && d.UploadedBy == EDocumentUploader.Student)
                .Select(MapToDto)
                .ToList(),
            CompanySupportingDocs = internship.Documents
                .Where(d => d.Slot == EDocumentSlot.Supporting && d.UploadedBy == EDocumentUploader.Company)
                .Select(MapToDto)
                .ToList(),
            StudentReport = internship.Documents
                .Where(d => d.Slot == EDocumentSlot.Report && d.UploadedBy == EDocumentUploader.Student)
                .Select(MapToDto)
                .FirstOrDefault(),
            CompanyReport = internship.Documents
                .Where(d => d.Slot == EDocumentSlot.Report && d.UploadedBy == EDocumentUploader.Company)
                .Select(MapToDto)
                .FirstOrDefault()
        };

        return Result<InternshipDocumentsStatusResDto>.Success(result);
    }

    public async Task<Result<InternshipDocumentResDto>> UploadDocumentAsync(
        Guid internshipId, Guid userId, EDocumentSlot slot, Stream fileStream, string fileName)
    {
        var internship = await dbContext.Internships
            .Include(i => i.Documents)
            .Include(i => i.Student)
            .Include(i => i.CompanyRepresentative)
            .Include(i => i.Company)
            .FirstOrDefaultAsync(i => i.Id == internshipId);

        if (internship == null)
        {
            return Result<InternshipDocumentResDto>.Failure(Error.NotFound);
        }

        // Check internship state - must be Confirmed or Approved
        if (internship.State != EInternshipState.Confirmed && internship.State != EInternshipState.Approved)
        {
            return Result<InternshipDocumentResDto>.Failure(Error.BadRequest);
        }

        var user = await dbContext.Users.FindAsync(userId);
        if (user == null)
        {
            return Result<InternshipDocumentResDto>.Failure(Error.Unauthorized);
        }

        EDocumentUploader uploader;
        if (internship.StudentId == userId)
        {
            uploader = EDocumentUploader.Student;
            
            // Student can only upload if the slot is not yet approved
            if ((slot == EDocumentSlot.Supporting && internship.IsSupportingDocsApprovedByCompany) ||
                (slot == EDocumentSlot.Report && internship.IsReportApprovedByCompany))
            {
                return Result<InternshipDocumentResDto>.Failure(Error.BadRequest);
            }
        }
        else if (internship.CompanyRepresentativeId == userId)
        {
            uploader = EDocumentUploader.Company;
        }
        else
        {
            return Result<InternshipDocumentResDto>.Failure(Error.Unauthorized);
        }

        // Check max documents for supporting slot
        if (slot == EDocumentSlot.Supporting)
        {
            var existingCount = internship.Documents
                .Count(d => d.Slot == EDocumentSlot.Supporting && d.UploadedBy == uploader);
            if (existingCount >= MaxSupportingDocs)
            {
                return Result<InternshipDocumentResDto>.Failure(Error.BadRequest);
            }
        }
        else if (slot == EDocumentSlot.Report)
        {
            // Only one report per uploader
            var existingReport = internship.Documents
                .FirstOrDefault(d => d.Slot == EDocumentSlot.Report && d.UploadedBy == uploader);
            if (existingReport != null)
            {
                // Delete existing and upload new
                await DeleteFromS3(existingReport.S3Key);
                dbContext.InternshipDocuments.Remove(existingReport);
            }
        }

        // Upload to S3
        var s3Key = $"internships/{internshipId}/documents/{slot}/{uploader}/{Guid.NewGuid()}_{fileName}";
        var uploadResult = await s3Service.UploadFileAsync(fileStream, internshipId, s3Key);
        if (uploadResult.IsFailure)
        {
            return Result<InternshipDocumentResDto>.Failure(uploadResult.Error);
        }

        var document = new InternshipDocument
        {
            InternshipId = internshipId,
            Slot = slot,
            UploadedBy = uploader,
            FileName = fileName,
            S3Key = uploadResult.Value.FileKey,
            UploadedAt = DateTime.UtcNow
        };

        dbContext.InternshipDocuments.Add(document);
        await dbContext.SaveChangesAsync();

        // Send email notification if student uploaded
        if (uploader == EDocumentUploader.Student)
        {
            await SendDocumentUploadedEmailAsync(internship);
        }

        return Result<InternshipDocumentResDto>.Success(MapToDto(document));
    }

    public async Task<Result<(Stream FileStream, string FileName, string ContentType)>> DownloadDocumentAsync(
        Guid internshipId, Guid documentId, Guid userId)
    {
        var internship = await dbContext.Internships
            .Include(i => i.Documents)
            .FirstOrDefaultAsync(i => i.Id == internshipId);

        if (internship == null)
        {
            return Result<(Stream, string, string)>.Failure(Error.NotFound);
        }

        var user = await dbContext.Users.FindAsync(userId);
        if (user == null)
        {
            return Result<(Stream, string, string)>.Failure(Error.Unauthorized);
        }

        var hasAccess = user.Role == ERole.InternshipHandler ||
                        internship.StudentId == userId ||
                        internship.CompanyRepresentativeId == userId;

        if (!hasAccess)
        {
            return Result<(Stream, string, string)>.Failure(Error.Unauthorized);
        }

        var document = internship.Documents.FirstOrDefault(d => d.Id == documentId);
        if (document == null)
        {
            return Result<(Stream, string, string)>.Failure(Error.NotFound);
        }

        var fileResponse = await s3Service.DownloadFileAsync(document.S3Key);
        return Result<(Stream, string, string)>.Success((fileResponse.FileStream, document.FileName, fileResponse.ContentType));
    }

    public async Task<Result> DeleteDocumentAsync(Guid internshipId, Guid documentId, Guid userId)
    {
        var internship = await dbContext.Internships
            .Include(i => i.Documents)
            .FirstOrDefaultAsync(i => i.Id == internshipId);

        if (internship == null)
        {
            return Result.Failure(Error.NotFound);
        }

        // Only student can delete their own documents, and only if not approved
        if (internship.StudentId != userId)
        {
            return Result.Failure(Error.Unauthorized);
        }

        var document = internship.Documents.FirstOrDefault(d => d.Id == documentId);
        if (document == null)
        {
            return Result.Failure(Error.NotFound);
        }

        if (document.UploadedBy != EDocumentUploader.Student)
        {
            return Result.Failure(Error.Unauthorized);
        }

        // Check if slot is already approved
        if ((document.Slot == EDocumentSlot.Supporting && internship.IsSupportingDocsApprovedByCompany) ||
            (document.Slot == EDocumentSlot.Report && internship.IsReportApprovedByCompany))
        {
            return Result.Failure(Error.BadRequest);
        }

        await DeleteFromS3(document.S3Key);
        dbContext.InternshipDocuments.Remove(document);
        await dbContext.SaveChangesAsync();

        return Result.Success();
    }

    public async Task<Result> ApproveDocumentsAsync(Guid internshipId, Guid userId)
    {
        var internship = await dbContext.Internships
            .Include(i => i.Documents)
            .Include(i => i.Student)
            .Include(i => i.CompanyRepresentative)
            .Include(i => i.Company)
            .FirstOrDefaultAsync(i => i.Id == internshipId);

        if (internship == null)
        {
            return Result.Failure(Error.NotFound);
        }

        // Only company representative can approve
        if (internship.CompanyRepresentativeId != userId)
        {
            return Result.Failure(Error.Unauthorized);
        }

        if (internship.State != EInternshipState.Confirmed)
        {
            return Result.Failure(Error.BadRequest);
        }

        // Check which slots have documents (from either student or company)
        var hasSupportingDocs = internship.Documents.Any(d => d.Slot == EDocumentSlot.Supporting);
        var hasReport = internship.Documents.Any(d => d.Slot == EDocumentSlot.Report);

        // Approve slots that have documents
        if (hasSupportingDocs)
        {
            internship.IsSupportingDocsApprovedByCompany = true;
        }
        if (hasReport)
        {
            internship.IsReportApprovedByCompany = true;
        }

        await dbContext.SaveChangesAsync();

        // Check if both slots are now approved
        var allApproved = internship.IsSupportingDocsApprovedByCompany && internship.IsReportApprovedByCompany;

        // Send email to student
        await SendDocumentsApprovedEmailToStudentAsync(internship, allApproved);

        // If all approved, send to coordinator
        if (allApproved)
        {
            await SendDocumentsReadyForCoordinatorEmailAsync(internship);
        }

        return Result.Success();
    }

    public async Task<Result> RejectDocumentsAsync(Guid internshipId, Guid userId)
    {
        var internship = await dbContext.Internships
            .Include(i => i.Documents)
            .Include(i => i.Student)
            .Include(i => i.Company)
            .FirstOrDefaultAsync(i => i.Id == internshipId);

        if (internship == null)
        {
            return Result.Failure(Error.NotFound);
        }

        // Only company representative can reject
        if (internship.CompanyRepresentativeId != userId)
        {
            return Result.Failure(Error.Unauthorized);
        }

        if (internship.State != EInternshipState.Confirmed)
        {
            return Result.Failure(Error.BadRequest);
        }

        // Delete all documents from S3
        foreach (var doc in internship.Documents)
        {
            await DeleteFromS3(doc.S3Key);
        }

        // Remove all documents from database
        dbContext.InternshipDocuments.RemoveRange(internship.Documents);

        // Reset approval flags
        internship.IsSupportingDocsApprovedByCompany = false;
        internship.IsReportApprovedByCompany = false;

        await dbContext.SaveChangesAsync();

        // Send email to student
        await SendDocumentsRejectedEmailAsync(internship);

        return Result.Success();
    }

    private static InternshipDocumentResDto MapToDto(InternshipDocument doc)
    {
        return new InternshipDocumentResDto
        {
            Id = doc.Id,
            Slot = doc.Slot,
            UploadedBy = doc.UploadedBy,
            FileName = doc.FileName,
            UploadedAt = doc.UploadedAt
        };
    }

    private Task DeleteFromS3(string s3Key)
    {
        // S3 service doesn't have delete method yet, but we can add it later
        // For now, we'll just remove from database
        return Task.CompletedTask;
    }

    private async Task SendDocumentUploadedEmailAsync(Internship internship)
    {
        var model = new DocumentUploadedMail
        {
            RecipientFirstName = internship.CompanyRepresentative.FirstName,
            StudentFirstName = internship.Student.FirstName,
            StudentLastName = internship.Student.LastName,
            InternshipName = internship.Name,
            CompanyName = internship.Company.Name
        };

        await mailService.SendMailTemplateAsync(
            internship.CompanyRepresentative.Email,
            "Nové dokumenty na schválenie",
            "Templates/DocumentUploadedMail.cshtml",
            model
        );
    }

    private async Task SendDocumentsApprovedEmailToStudentAsync(Internship internship, bool allApproved)
    {
        var model = new DocumentsApprovedMail
        {
            RecipientFirstName = internship.Student.FirstName,
            StudentFirstName = internship.Student.FirstName,
            StudentLastName = internship.Student.LastName,
            InternshipName = internship.Name,
            CompanyName = internship.Company.Name,
            AllDocumentsApproved = allApproved,
            SentToCoordinator = allApproved
        };

        await mailService.SendMailTemplateAsync(
            internship.Student.Email,
            allApproved ? "Všetky dokumenty boli schválené" : "Dokumenty boli schválené",
            "Templates/DocumentsApprovedMail.cshtml",
            model
        );
    }

    private async Task SendDocumentsRejectedEmailAsync(Internship internship)
    {
        var model = new DocumentsRejectedMail
        {
            StudentFirstName = internship.Student.FirstName,
            InternshipName = internship.Name,
            CompanyName = internship.Company.Name
        };

        await mailService.SendMailTemplateAsync(
            internship.Student.Email,
            "Dokumenty neboli schválené",
            "Templates/DocumentsRejectedMail.cshtml",
            model
        );
    }

    private async Task SendDocumentsReadyForCoordinatorEmailAsync(Internship internship)
    {
        // Find all internship handlers to notify
        var handlers = await dbContext.Users
            .Where(u => u.Role == ERole.InternshipHandler)
            .ToListAsync();

        foreach (var handler in handlers)
        {
            var model = new DocumentsReadyForCoordinatorMail
            {
                CoordinatorFirstName = handler.FirstName,
                StudentFirstName = internship.Student.FirstName,
                StudentLastName = internship.Student.LastName,
                InternshipName = internship.Name,
                CompanyName = internship.Company.Name
            };

            await mailService.SendMailTemplateAsync(
                handler.Email,
                "Prax čaká na schválenie",
                "Templates/DocumentsReadyForCoordinatorMail.cshtml",
                model
            );
        }
    }

    public async Task<Result> SubmitDocumentsForApprovalAsync(Guid internshipId, Guid userId)
    {
        var internship = await dbContext.Internships
            .Include(i => i.Documents)
            .Include(i => i.Student)
            .Include(i => i.CompanyRepresentative)
            .Include(i => i.Company)
            .FirstOrDefaultAsync(i => i.Id == internshipId);

        if (internship == null)
        {
            return Result.Failure(Error.NotFound);
        }

        // Only students can submit documents for approval
        if (internship.StudentId != userId)
        {
            return Result.Failure(Error.Unauthorized);
        }

        // Check if there are any student documents to submit
        var hasStudentDocs = internship.Documents.Any(d => d.UploadedBy == EDocumentUploader.Student);
        if (!hasStudentDocs)
        {
            return Result.Failure(Error.BadRequest);
        }

        // Send email to company representative
        var model = new DocumentsSubmittedForApprovalMail
        {
            RepresentativeFirstName = internship.CompanyRepresentative.FirstName,
            RepresentativeLastName = internship.CompanyRepresentative.LastName,
            StudentFirstName = internship.Student.FirstName,
            StudentLastName = internship.Student.LastName,
            StudentEmail = internship.Student.Email,
            InternshipName = internship.Name,
            CompanyName = internship.Company.Name
        };

        await mailService.SendMailTemplateAsync(
            internship.CompanyRepresentative.Email,
            "Dokumenty na schválenie",
            "Templates/DocumentsSubmittedForApprovalMail.cshtml",
            model
        );

        return Result.Success();
    }
}
