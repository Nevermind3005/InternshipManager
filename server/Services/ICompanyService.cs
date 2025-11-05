using server.Foundation.Result;
using server.Models.Company;

namespace server.Services;

public interface ICompanyService
{
    Task<Result<CompanyResDto>> CreateCompanyAsync(CompanyReqDto request);
    Task<Result<CompanyResDto>> GetCompanyByIdAsync(Guid id);
    Task<Result<List<CompanyResDto>>> GetCompaniesAsync();
}