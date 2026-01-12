using server.Data;
using server.Foundation.Result;
using server.Models;
using server.Models.Filters;
using server.Models.Internship;

namespace server.Services;

public interface IInternshipService
{
    Task<Result<InternshipResDto>> CreateInternshipAsync(InternshipReqDto request);
    Task<Result<InternshipResDto>> GetInternshipByIdAsync(Guid id);
    Task<Result<PagedResult<InternshipResDto>>> GetInternshipsAsync(InternshipFilter filter, int skip, int limit);
    Task<Result<InternshipResDto>> UpdateInternshipAsync(Guid id, InternshipReqDto request);
    Task<Result<InternshipResDto>> ChangeStateAsync(Guid id, EInternshipState newState);
}