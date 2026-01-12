using AutoMapper;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Entities;
using server.Foundation.Result;
using server.Foundation.Utils;
using server.Models;
using server.Models.Filters;
using server.Models.Internship;

namespace server.Services;

public class InternshipService(
    ApplicationDbContext context,
    IMapper mapper,
    IInternshipNotificationService notificationService
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

        // Query back the internship with all relationships included
        var internshipWithRelations = await context.Internships
            .Include(i => i.Student)
            .Include(i => i.CompanyRepresentative)
            .Include(i => i.Company)
            .Include(i => i.StudyProgram)
            .FirstOrDefaultAsync(i => i.Id == dbInternship.Entity.Id);

        // Check for null BEFORE mapping (should never happen, but defensive programming)
        if (internshipWithRelations is null)
        {
            return Result<InternshipResDto>.Failure(Error.NotFound);
        }

        // Map the entity with loaded relationships
        var response = mapper.Map<InternshipResDto>(internshipWithRelations);

        // Send notification (don't fail internship creation if this fails)
        try
        {
            await notificationService.NotifyInternshipCreatedAsync(internshipWithRelations);
        }
        catch (Exception ex)
        {
            // Log the error but don't fail the internship creation
            // The internship was successfully created, only notification failed
            Console.WriteLine($"Failed to send internship creation email: {ex.Message}");
        }
        
        return Result<InternshipResDto>.Success(response);
    }

    public async Task<Result<InternshipResDto>> GetInternshipByIdAsync(Guid id)
    {
        var internship = await context.Internships
            .Include(i => i.Company)
            .Include(i => i.CompanyRepresentative)
            .Include(i => i.StudyProgram)
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
        
        if (filter.StudentId is not null)
        {
            query = query.Where(i => i.StudentId == filter.StudentId);
        }
        
        if (filter.CompanyRepresentativeId is not null)
        {
            query = query.Where(i => i.CompanyRepresentativeId == filter.CompanyRepresentativeId);
        }
        
        if (filter.StudyProgramId is not null)
        {
            query = query.Where(i => i.StudyProgramId == filter.StudyProgramId);
        }
        
        var totalCount = await query.CountAsync();
        
        var items = await query
            .Include(i => i.Student)
            .Include(i => i.Company)
            .Include(i => i.CompanyRepresentative)
            .Include(i => i.StudyProgram)
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
            .Include(i => i.StudyProgram)
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
        internship.StudyProgramId = request.StudyProgramId;

        await context.SaveChangesAsync();

        var response = mapper.Map<InternshipResDto>(internship);
        
        return Result<InternshipResDto>.Success(response);
    }

    public async Task<Result<InternshipResDto>> ChangeStateAsync(Guid id, EInternshipState newState, ERole editorRole)
    {
        var internship = await context.Internships
            .Include(i => i.Student)
            .Include(i => i.CompanyRepresentative)
            .Include(i => i.Company)
            .Include(i => i.StudyProgram)
            .FirstOrDefaultAsync(i => i.Id == id);

        if (internship is null)
        {
            return Result<InternshipResDto>.Failure(Error.NotFound);
        }

        var currentState = internship.State;

        // Validate state transition using InternshipStatics
        var isAllowed = InternshipStatics.IsStateChangeAllowed(currentState, newState, editorRole);

        if (!isAllowed)
        {
            return Result<InternshipResDto>.Failure(Error.BadRequest);
        }

        internship.State = newState;
        await context.SaveChangesAsync();

        // Send notification to student about state change (don't fail if email fails)
        try
        {
            await notificationService.NotifyStateChangeAsync(internship, currentState, newState);
        }
        catch (Exception ex)
        {
            // Log the error but don't fail the state change
            Console.WriteLine($"Failed to send state change email: {ex.Message}");
        }

        var response = mapper.Map<InternshipResDto>(internship);
        return Result<InternshipResDto>.Success(response);
    }

    private static bool HasValidDateRange(InternshipReqDto request) =>
        request.EndDate > request.StartDate;

}