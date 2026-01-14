using server.Foundation.Result;
using server.Models.Auth;
using server.Models.User;
using server.Models.User.InternshipHandler;
using server.Models.User.Representative;
using server.Models.User.Student;

namespace server.Services;

public interface IAuthService
{
    Task<Result<UserResDto>> RegisterStudentAsync(StudentRegisterReqDto request);
    Task<Result<UserResDto>> RegisterInternshipHandlerAsync(InternshipHandlerRegisterReqDto request);
    Task<Result<UserResDto>> RegisterCompanyRepresentativeAsync(CompanyRepresentativeRegisterReqDto request);
    Task<Result<UserResDto>> GetUserByIdAsync(Guid userId);
    Task<Result<TokenResDto>> LoginAsync(LoginReqDto request);
    Task<Result<TokenResDto>> RefreshTokensAsync(RefreshTokenReqDto request);
    Task<Result<TokenResDto>> ChangeDefaultPassword(ChangeDefaultPasswordReqDto request);
    Task<Result> LogoutAsync(string accessToken);
    Task<Result> ChangePasswordAsync(Guid userId, ChangePasswordReqDto request);
    
    /// <summary>
    /// Initiates password reset flow by generating a token and sending email.
    /// Always returns success to prevent email enumeration.
    /// </summary>
    Task<Result> ForgotPasswordAsync(ForgotPasswordReqDto request);
    
    /// <summary>
    /// Completes password reset by validating token and setting new password.
    /// </summary>
    Task<Result> ResetPasswordAsync(ResetPasswordReqDto request);
    
    [Obsolete("Use ForgotPasswordAsync and ResetPasswordAsync instead. This method generates a new password directly which is less secure.")]
    Task<Result> ResetUserPasswordAsync(UserResetPasswordReqDto request);
}