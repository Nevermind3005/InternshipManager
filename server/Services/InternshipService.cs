using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using server.Data;
using server.Entities;
using server.Foundation.Result;
using server.Foundation.Utils;
using server.Models;
using server.Models.Filters;
using server.Models.Internship;
using server.Models.Mail;

namespace server.Services;

public class InternshipService(
    ApplicationDbContext context,
    IMapper mapper,
    IMailService mailService,
    IConfiguration configuration,
    ILogger<InternshipService> logger
    ) : IInternshipService
{
    public async Task<Result<InternshipResDto>> CreateInternshipAsync(InternshipReqDto request)
    {
        if (!HasValidDateRange(request))
        {
            return Result<InternshipResDto>.Failure(Error.BadRequest);
        }
        
        // Find company with corresponding id and representative
        var company = await context.Companies
            .Where(c => c.Id == request.CompanyId &&
                        c.Representatives.Any(u => u.Id == request.CompanyRepresentativeId))
            .FirstOrDefaultAsync();

        // Company not found - wrong company or representative id or representative doesn't belong to the company
        if (company is null)
        {
            return Result<InternshipResDto>.Failure(Error.BadRequest);
        }
        
        var internship = mapper.Map<Internship>(request);

        internship.State = EInternshipState.Created;
        
        var dbInternship = await context.AddAsync(internship);
        
        await context.SaveChangesAsync();

        // Load related entities for email notification
        await context.Entry(dbInternship.Entity).Reference(i => i.Student).LoadAsync();
        await context.Entry(dbInternship.Entity).Reference(i => i.CompanyRepresentative).LoadAsync();
        await context.Entry(dbInternship.Entity).Reference(i => i.Company).LoadAsync();

        // Send email to company representative
        await SendInternshipNotificationEmailAsync(dbInternship.Entity);

        var response = mapper.Map<InternshipResDto>(dbInternship.Entity);
        
        return Result<InternshipResDto>.Success(response);
    }

    public async Task<Result<InternshipResDto>> GetInternshipByIdAsync(Guid id)
    {
        var internship = await context.Internships
            .Include(i => i.Company)
            .Include(i => i.CompanyRepresentative)
            .Include(i => i.Student)
            .Where(i => i.Id == id)
            .FirstOrDefaultAsync();

        if (internship is null)
        {
            return Result<InternshipResDto>.Failure(Error.NotFound);
        }

        var result = mapper.Map<InternshipResDto>(internship);
        
        return Result<InternshipResDto>.Success(result);
    }

    public async Task<Result<InternshipResDto>> GetInternshipByIdWithTokenAsync(Guid id, string? token)
    {
        // Validate token is provided
        if (string.IsNullOrWhiteSpace(token))
        {
            return Result<InternshipResDto>.Failure(Error.Unauthorized);
        }

        // Verify token exists and is valid for this internship
        var approvalToken = await context.InternshipApprovalTokens
            .FirstOrDefaultAsync(t => t.InternshipId == id && t.Token == token);

        if (approvalToken is null)
        {
            return Result<InternshipResDto>.Failure(Error.Unauthorized);
        }

        // Check if token is expired
        if (approvalToken.ExpiresAt < DateTime.UtcNow)
        {
            return Result<InternshipResDto>.Failure(Error.TokenExpired);
        }

        // Token is valid, return the internship data
        return await GetInternshipByIdAsync(id);
    }

    public async Task<Result<PagedResult<InternshipResDto>>> GetInternshipsAsync(InternshipFilter filter, int skip, int limit)
    {
        var query = context.Internships.AsQueryable();

        if (!string.IsNullOrEmpty(filter.Name))
        {
            query = query.Where(i => EF.Functions.ILike(i.Name, $"%{filter.Name}%"));
        }
        
        if (!string.IsNullOrEmpty(filter.FirstName))
        {
            query = query.Where(i => EF.Functions.ILike(i.Student.FirstName, $"%{filter.FirstName}%"));
        }
        
        if (!string.IsNullOrEmpty(filter.LastName))
        {
            query = query.Where(i => EF.Functions.ILike(i.Student.LastName, $"%{filter.LastName}%"));
        }
        
        if (!string.IsNullOrEmpty(filter.Company))
        {
            query = query.Where(i => EF.Functions.ILike(i.Company.Name, $"%{filter.Company}%"));
        }        

        if (filter.Year is not null)
        {
            query = query.Where(i => i.Year == filter.Year);
        }
        
        if (filter.Semester is not null)
        {
            query = query.Where(i => i.Semester == filter.Semester);
        }
        
        if (filter.State is not null)
        {
            query = query.Where(i => i.State == filter.State);
        }
        
        var totalCount = await query.CountAsync();
        
        var items = await query
            .Include(i => i.Student)
            .Include(i => i.Company)
            .Include(i => i.CompanyRepresentative)
            .Skip(skip)
            .Take(limit)
            .ToListAsync();

        var result = mapper.Map<List<InternshipResDto>>(items);
        
        var pagedResult = new PagedResult<InternshipResDto>
        {
            Items = result,
            TotalCount = totalCount,
            PageSize = result.Count
        };

        return Result<PagedResult<InternshipResDto>>.Success(pagedResult);
    }

    public async Task<Result<InternshipResDto>> UpdateInternshipAsync(Guid id, InternshipReqDto request)
    {
        if (!HasValidDateRange(request))
        {
            return Result<InternshipResDto>.Failure(Error.BadRequest);
        }
        
        var internship = await context.Internships
            .Include(i => i.Company)
            .Include(i => i.Student)
            .Include(i => i.CompanyRepresentative)
            .FirstOrDefaultAsync(i => i.Id == id);

        if (internship is null)
        {
            return Result<InternshipResDto>.Failure(Error.NotFound);
        }

        // Find company with corresponding id and representative
        var company = await context.Companies
            .Where(c => c.Id == request.CompanyId &&
                        c.Representatives.Any(u => u.Id == request.CompanyRepresentativeId))
            .FirstOrDefaultAsync();

        // Company not found - wrong company or representative id or representative doesn't belong to the company
        if (company is null)
        {
            return Result<InternshipResDto>.Failure(Error.BadRequest);
        }

        // Update fields but preserve State and StudentId
        internship.Name = request.Name;
        internship.Description = request.Description;
        internship.StartDate = request.StartDate;
        internship.EndDate = request.EndDate;
        internship.Year = request.Year;
        internship.Semester = request.Semester;
        internship.CompanyRepresentativeId = request.CompanyRepresentativeId;
        internship.CompanyId = request.CompanyId;

        await context.SaveChangesAsync();

        var response = mapper.Map<InternshipResDto>(internship);
        
        return Result<InternshipResDto>.Success(response);
    }

    public async Task<Result<InternshipResDto>> ChangeStateAsync(Guid id, EInternshipState newState)
    {
        var internship = await context.Internships
            .Include(i => i.Student)
            .Include(i => i.CompanyRepresentative)
            .Include(i => i.Company)
            .FirstOrDefaultAsync(i => i.Id == id);

        if (internship is null)
        {
            return Result<InternshipResDto>.Failure(Error.NotFound);
        }

        var currentState = internship.State;

        // Validate state transition
        // For public endpoint (email link), allow Created -> Confirmed or Created -> Rejected
        // This allows company representatives to approve/decline without authentication
        var isAllowed = (currentState, newState) switch
        {
            (EInternshipState.Created, EInternshipState.Confirmed) => true,
            (EInternshipState.Created, EInternshipState.Rejected) => true,
            _ => false
        };

        if (!isAllowed)
        {
            return Result<InternshipResDto>.Failure(Error.BadRequest);
        }

        internship.State = newState;
        await context.SaveChangesAsync();

        var response = mapper.Map<InternshipResDto>(internship);
        return Result<InternshipResDto>.Success(response);
    }

    private static bool HasValidDateRange(InternshipReqDto request) =>
        request.EndDate > request.StartDate;

    private async Task SendInternshipNotificationEmailAsync(Internship internship)
    {
        try
        {
            var frontendUrl = configuration.GetRequiredSection("Consumers")["FrontendURL"];
            if (string.IsNullOrEmpty(frontendUrl))
            {
                logger.LogError(
                    "Failed to send internship notification email for internship {InternshipId}: Frontend URL is not configured",
                    internship.Id);
                return;
            }

            // Generate approval token
            var tokenResult = await GenerateApprovalTokenAsync(internship.Id);
            if (tokenResult.IsFailure)
            {
                logger.LogError(
                    "Failed to generate approval token for internship {InternshipId}: {Error}",
                    internship.Id,
                    tokenResult.Error.Description);
                return;
            }

            var token = tokenResult.Value;
            var internshipLink = $"{frontendUrl}/internships/view/{internship.Id}?token={token}";

            var mailTemplateModel = new CompanyRepresentativeInternshipMail
            {
                RepresentativeFirstName = internship.CompanyRepresentative.FirstName,
                RepresentativeLastName = internship.CompanyRepresentative.LastName,
                InternshipName = internship.Name,
                StudentFirstName = internship.Student.FirstName,
                StudentLastName = internship.Student.LastName,
                StudentEmail = internship.Student.Email,
                InternshipLink = internshipLink
            };

            await mailService.SendMailTemplateAsync(
                internship.CompanyRepresentative.Email,
                "Nová stáž - InternshipManager",
                "Templates/CompanyRepresentativeInternshipMail.cshtml",
                mailTemplateModel
            );

            logger.LogInformation(
                "Successfully sent internship notification email for internship {InternshipId} to {Email}",
                internship.Id,
                internship.CompanyRepresentative.Email);
        }
        catch (Exception ex)
        {
            logger.LogError(
                ex,
                "Failed to send internship notification email for internship {InternshipId} to {Email}",
                internship.Id,
                internship.CompanyRepresentative.Email);
            // Don't throw - email failure should not prevent internship creation
        }
    }

    public async Task<Result<string>> GenerateApprovalTokenAsync(Guid internshipId)
    {
        var internship = await context.Internships.FindAsync(internshipId);
        if (internship is null)
        {
            return Result<string>.Failure(Error.NotFound);
        }

        // Generate a cryptographically secure random token
        var tokenBytes = new byte[32];
        System.Security.Cryptography.RandomNumberGenerator.Fill(tokenBytes);
        var token = Convert.ToBase64String(tokenBytes).Replace("+", "-").Replace("/", "_").Replace("=", "");

        var approvalToken = new InternshipApprovalToken
        {
            Id = Guid.NewGuid(),
            InternshipId = internshipId,
            Token = token,
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddDays(30), // Token valid for 30 days
            IsUsed = false
        };

        await context.InternshipApprovalTokens.AddAsync(approvalToken);
        await context.SaveChangesAsync();

        return Result<string>.Success(token);
    }

    public async Task<Result<InternshipResDto>> ChangeStateWithTokenAsync(Guid internshipId, string? token, EInternshipState newState)
    {
        // Validate token is provided
        if (string.IsNullOrWhiteSpace(token))
        {
            return Result<InternshipResDto>.Failure(Error.Unauthorized);
        }

        // Find the token
        var approvalToken = await context.InternshipApprovalTokens
            .FirstOrDefaultAsync(t => t.InternshipId == internshipId && t.Token == token);

        if (approvalToken is null)
        {
            return Result<InternshipResDto>.Failure(Error.Unauthorized);
        }

        // Check if token is expired
        if (approvalToken.ExpiresAt < DateTime.UtcNow)
        {
            return Result<InternshipResDto>.Failure(Error.TokenExpired);
        }

        // Check if token has already been used
        if (approvalToken.IsUsed)
        {
            return Result<InternshipResDto>.Failure(Error.TokenAlreadyUsed);
        }

        // Use transaction to ensure atomicity
        await using var transaction = await context.Database.BeginTransactionAsync();
        
        try
        {
            // Change the internship state first
            var result = await ChangeStateAsync(internshipId, newState);
            
            if (result.IsFailure)
            {
                await transaction.RollbackAsync();
                return result;
            }

            // Only mark token as used if state change succeeded
            approvalToken.IsUsed = true;
            approvalToken.UsedAt = DateTime.UtcNow;
            
            await context.SaveChangesAsync();
            await transaction.CommitAsync();
            
            return result;
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }
}