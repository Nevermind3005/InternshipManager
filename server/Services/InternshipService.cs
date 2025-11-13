using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
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
    IConfiguration configuration
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

        // Load the internship with related entities for email
        var internshipWithRelations = await context.Internships
            .Include(i => i.Student)
            .Include(i => i.CompanyRepresentative)
            .Include(i => i.Company)
            .FirstOrDefaultAsync(i => i.Id == dbInternship.Entity.Id);

        if (internshipWithRelations is not null)
        {
            // Send email to company representative
            await SendInternshipNotificationEmailAsync(internshipWithRelations);
        }

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
        var frontendUrl = configuration.GetRequiredSection("Consumers")["FrontendURL"];
        if (string.IsNullOrEmpty(frontendUrl))
        {
            // Log error or throw exception if frontend URL is not configured
            return;
        }

        var internshipLink = $"{frontendUrl}/internships/view/{internship.Id}";

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
    }
}