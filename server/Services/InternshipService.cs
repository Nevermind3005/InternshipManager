using AutoMapper;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Entities;
using server.Foundation.Result;
using server.Models;
using server.Models.Filters;
using server.Models.Internship;

namespace server.Services;

public class InternshipService(
    ApplicationDbContext context,
    IMapper mapper
    ) : IInternshipService
{
    public async Task<Result<InternshipResDto>> CreateInternshipAsync(InternshipReqDto request)
    {
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

        var response = mapper.Map<InternshipResDto>(dbInternship.Entity);
        
        return Result<InternshipResDto>.Success(response);
    }

    public async Task<Result<InternshipResDto>> GetInternshipByIdAsync(Guid id)
    {
        var internship = await context.Internships.Include(i => i.Company).Include(i => i.CompanyRepresentative).Where(i => i.Id == id).FirstOrDefaultAsync();

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
}