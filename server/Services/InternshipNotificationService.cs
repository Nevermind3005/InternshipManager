using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using server.Data;
using server.Entities;
using server.Models.Mail;

namespace server.Services;

public class InternshipNotificationService(
    IMailService mailService,
    ILogger<InternshipNotificationService> logger,
    ApplicationDbContext dbContext
    ) : IInternshipNotificationService
{
    private const string TemplateBasePath = "Templates/";

    public async Task NotifyInternshipCreatedAsync(Internship internship)
    {
        var representativeEmail = internship.CompanyRepresentative.Email;

        var model = new InternshipCreatedMail
        {
            RepresentativeFirstName = internship.CompanyRepresentative.FirstName,
            RepresentativeLastName = internship.CompanyRepresentative.LastName,
            StudentFirstName = internship.Student.FirstName,
            StudentLastName = internship.Student.LastName,
            StudentEmail = internship.Student.Email,
            InternshipName = internship.Name,
            CompanyName = internship.Company.Name,
            StartDate = internship.StartDate,
            EndDate = internship.EndDate,
            StudyProgramCode = internship.StudyProgram?.Code
        };

        await mailService.SendMailTemplateAsync(
            representativeEmail,
            "Nová prax čaká na schválenie",
            $"{TemplateBasePath}InternshipCreatedMail.cshtml",
            model
        );
    }

    public async Task NotifyInternshipUpdatedAsync(Internship internship)
    {
        var studentEmail = internship.Student.Email;

        var model = new InternshipUpdatedMail
        {
            StudentFirstName = internship.Student.FirstName,
            StudentLastName = internship.Student.LastName,
            InternshipName = internship.Name,
            CompanyName = internship.Company.Name,
            StartDate = internship.StartDate,
            EndDate = internship.EndDate,
            Year = internship.Year,
            Semester = internship.Semester.ToString(),
            StudyProgramCode = internship.StudyProgram?.Code
        };

        await mailService.SendMailTemplateAsync(
            studentEmail,
            "Vaša prax bola upravená",
            $"{TemplateBasePath}InternshipUpdatedMail.cshtml",
            model
        );
    }

    public async Task NotifyStateChangeAsync(Internship internship, EInternshipState oldState, EInternshipState newState)
    {
        // Only send notifications for actual state changes
        if (oldState == newState)
        {
            return;
        }

        var studentEmail = internship.Student.Email;

        switch (newState)
        {
            case EInternshipState.Confirmed:
                await SendConfirmedNotificationAsync(internship, studentEmail);
                break;

            case EInternshipState.Rejected:
                // Distinguish who rejected: company (Created->Rejected) or handler (Confirmed->Rejected)
                if (oldState == EInternshipState.Created)
                {
                    await SendRejectedByCompanyNotificationAsync(internship, studentEmail);
                }
                else if (oldState == EInternshipState.Confirmed)
                {
                    await SendRejectedByHandlerNotificationAsync(internship, studentEmail);
                }
                else
                {
                    // Unexpected state transition to Rejected - log for investigation
                    logger.LogWarning(
                        "Unexpected state transition to Rejected for internship {InternshipId}: {OldState} -> {NewState}. No notification sent.",
                        internship.Id, oldState, newState);
                }
                break;

            case EInternshipState.Approved:
                await SendApprovedNotificationAsync(internship, studentEmail);
                break;

            case EInternshipState.Passed:
                await SendPassedNotificationAsync(internship, studentEmail);
                break;

            case EInternshipState.Failed:
                await SendFailedNotificationAsync(internship, studentEmail);
                break;

            case EInternshipState.Created:
                // No notification needed when state is Created
                break;
        }
    }

    private async Task SendConfirmedNotificationAsync(Internship internship, string studentEmail)
    {
        // Send notification to student
        var studentModel = new InternshipConfirmedMail
        {
            StudentFirstName = internship.Student.FirstName,
            StudentLastName = internship.Student.LastName,
            InternshipName = internship.Name,
            CompanyName = internship.Company.Name,
            CompanyRepresentativeName = $"{internship.CompanyRepresentative.FirstName} {internship.CompanyRepresentative.LastName}",
            StartDate = internship.StartDate,
            EndDate = internship.EndDate
        };

        await mailService.SendMailTemplateAsync(
            studentEmail,
            "Prax potvrdená spoločnosťou",
            $"{TemplateBasePath}InternshipConfirmedMail.cshtml",
            studentModel
        );

        // Send notification to all coordinators (InternshipHandlers)
        var coordinators = await dbContext.Users
            .Where(u => u.Role == ERole.InternshipHandler)
            .ToListAsync();

        if (coordinators.Count > 0)
        {
            var coordinatorModel = new InternshipConfirmedForCoordinatorMail
            {
                StudentFirstName = internship.Student.FirstName,
                StudentLastName = internship.Student.LastName,
                StudentEmail = internship.Student.Email,
                StudentPhone = internship.Student.Phone,
                StudyProgramCode = internship.StudyProgram?.Code,
                InternshipName = internship.Name,
                CompanyName = internship.Company.Name,
                CompanyRepresentativeName = $"{internship.CompanyRepresentative.FirstName} {internship.CompanyRepresentative.LastName}",
                CompanyRepresentativeEmail = internship.CompanyRepresentative.Email,
                StartDate = internship.StartDate,
                EndDate = internship.EndDate,
                Year = internship.Year,
                Semester = internship.Semester.ToString()
            };

            foreach (var coordinator in coordinators)
            {
                try
                {
                    await mailService.SendMailTemplateAsync(
                        coordinator.Email,
                        "Nová prax potvrdená firmou",
                        $"{TemplateBasePath}InternshipConfirmedForCoordinatorMail.cshtml",
                        coordinatorModel
                    );
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "Failed to send confirmation email to coordinator {CoordinatorEmail}", coordinator.Email);
                }
            }
        }
    }

    private async Task SendRejectedByCompanyNotificationAsync(Internship internship, string studentEmail)
    {
        var model = new InternshipRejectedMail
        {
            StudentFirstName = internship.Student.FirstName,
            StudentLastName = internship.Student.LastName,
            InternshipName = internship.Name,
            CompanyName = internship.Company.Name,
            CompanyRepresentativeName = $"{internship.CompanyRepresentative.FirstName} {internship.CompanyRepresentative.LastName}"
        };

        await mailService.SendMailTemplateAsync(
            studentEmail,
            "Prax zamietnutá spoločnosťou",
            $"{TemplateBasePath}InternshipRejectedMail.cshtml",
            model
        );
    }

    private async Task SendRejectedByHandlerNotificationAsync(Internship internship, string studentEmail)
    {
        var model = new InternshipRejectedByHandlerMail
        {
            StudentFirstName = internship.Student.FirstName,
            StudentLastName = internship.Student.LastName,
            InternshipName = internship.Name,
            CompanyName = internship.Company.Name
        };

        await mailService.SendMailTemplateAsync(
            studentEmail,
            "Prax zamietnutá koordinátorom",
            $"{TemplateBasePath}InternshipRejectedByHandlerMail.cshtml",
            model
        );
    }

    private async Task SendApprovedNotificationAsync(Internship internship, string studentEmail)
    {
        var model = new InternshipApprovedMail
        {
            StudentFirstName = internship.Student.FirstName,
            StudentLastName = internship.Student.LastName,
            InternshipName = internship.Name,
            CompanyName = internship.Company.Name,
            StartDate = internship.StartDate,
            EndDate = internship.EndDate
        };

        await mailService.SendMailTemplateAsync(
            studentEmail,
            "Prax schválená koordinátorom",
            $"{TemplateBasePath}InternshipApprovedMail.cshtml",
            model
        );
    }

    private async Task SendPassedNotificationAsync(Internship internship, string studentEmail)
    {
        var model = new InternshipPassedMail
        {
            StudentFirstName = internship.Student.FirstName,
            StudentLastName = internship.Student.LastName,
            InternshipName = internship.Name,
            CompanyName = internship.Company.Name,
            StartDate = internship.StartDate,
            EndDate = internship.EndDate
        };

        await mailService.SendMailTemplateAsync(
            studentEmail,
            "Prax úspešne ukončená",
            $"{TemplateBasePath}InternshipPassedMail.cshtml",
            model
        );
    }

    private async Task SendFailedNotificationAsync(Internship internship, string studentEmail)
    {
        var model = new InternshipFailedMail
        {
            StudentFirstName = internship.Student.FirstName,
            StudentLastName = internship.Student.LastName,
            InternshipName = internship.Name,
            CompanyName = internship.Company.Name,
            StartDate = internship.StartDate,
            EndDate = internship.EndDate
        };

        await mailService.SendMailTemplateAsync(
            studentEmail,
            "Prax neúspešne ukončená",
            $"{TemplateBasePath}InternshipFailedMail.cshtml",
            model
        );
    }
}
