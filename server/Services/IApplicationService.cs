using server.Foundation.Result;
using server.Models;
using server.Models.OAuth;

namespace server.Services;

public interface IApplicationService
{
    public Task<Result<ApplicationCreateResDto>> CreateNewApplicationAsync(ApplicationCreateReqDto request);
    public Task<Result<PagedResult<ApplicationResDto>>> GetAllApplicationsAsync(int skip, int limit);
    public Task<Result<ApplicationTokenResDto>> GetApplicationTokenAsync(ApplicationTokenReqDto request);
}