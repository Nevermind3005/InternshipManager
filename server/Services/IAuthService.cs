using server.Foundation.Result;
using server.Models.Auth;
using server.Models.User;
using server.Models.User.InternshipHandler;
using server.Models.User.Student;

namespace server.Services;

public interface IAuthService
{
    Task<Result<UserResDto>> RegisterStudentAsync(StudentRegisterReqDto request);
    Task<Result<UserResDto>> RegisterInternshipHandlerAsync(InternshipHandlerRegisterReqDto request);
    Task<Result<TokenResDto>> LoginAsync(LoginReqDto request);
    Task<Result<TokenResDto>> RefreshTokensAsync(RefreshTokenReqDto request);
    Task<Result<TokenResDto>> ChangeDefaultPassword(ChangeDefaultPasswordReqDto request);
    Task<Result> LogoutAsync(string accessToken);
    Task<Result<UserResDto>> GetUserByIdAsync(Guid userId);
    Task<Result> ChangePasswordAsync(Guid userId, ChangePasswordReqDto request);
}