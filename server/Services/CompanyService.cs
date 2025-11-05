using AutoMapper;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Entities;
using server.Foundation.Result;
using server.Models.Company;

namespace server.Services;

public class CompanyService(
    ApplicationDbContext context,
    IMapper mapper
    ) : ICompanyService
{
    public async Task<Result<CompanyResDto>> CreateCompanyAsync(CompanyReqDto request)
    {
        var company = mapper.Map<Company>(request);

        var dbCompany = await context.Companies.AddAsync(company);
        
        await context.SaveChangesAsync();
        
        var response = mapper.Map<CompanyResDto>(dbCompany.Entity);
        
        return Result<CompanyResDto>.Success(response);
    }

    public async Task<Result<CompanyResDto>> GetCompanyByIdAsync(Guid id)
    {
        var company = await context.Companies.FindAsync(id);

        if (company is null)
        {
            return Result<CompanyResDto>.Failure(Error.NotFound);
        }
        
        var result = mapper.Map<CompanyResDto>(company);
        
        return Result<CompanyResDto>.Success(result);
    }

    public async Task<Result<List<CompanyResDto>>> GetCompaniesAsync()
    {
        var companies = await context.Companies.ToListAsync();
        
        var result = mapper.Map<List<CompanyResDto>>(companies);

        return Result<List<CompanyResDto>>.Success(result);
    }
}