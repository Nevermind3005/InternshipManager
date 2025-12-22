using server.Foundation.Result;
using server.Models.OAuth;

namespace server.Services;

public interface IApplicationService
{
    public Task<Result<ApplicationCreateResDto>> CreateNewApplicationAsync(ApplicationCreateReqDto request);
    public Task<Result<ApplicationTokenResDto>> GetApplicationTokenAsync(ApplicationTokenReqDto request);
    // public Task<Result<List<ApplicationResDto>>> GetAll();
}