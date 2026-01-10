using System.Security.Claims;
using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Data;
using server.Foundation.Result;
using server.Models.Auth;
using server.Models.User;
using server.Models.User.InternshipHandler;
using server.Models.User.Representative;
using server.Models.User.Student;
using server.Services;
using Wangkanai.Detection.Services;

namespace server.Controllers;

[ApiController]
[ApiVersion(1)]
[Route("api/v{version:apiVersion}/[controller]")]
public class AuthController(
    IAuthService authService
    ) : ControllerBase
{
    /// <summary>
    /// Register a student user.
    /// </summary>
    /// <param name="request">JSON containing student info</param>
    /// <response code="200">Returns a user object.</response>
    /// <response code="400">If a user with given email already exists.</response>
    [HttpPost("register/student")]
    public async Task<ActionResult<UserResDto>> RegisterStudent(StudentRegisterReqDto request)
    {
        var result = await authService.RegisterStudentAsync(request);

        if (result.IsFailure)
        {
            return result.ToProblemDetails();
        }
        
        return CreatedAtAction(
            nameof(GetUserById), 
            new { id = result.Value.Id, Version = "1" },
            result.Value
        );
    }
    
    /// <summary>
    /// Register a internship handler user.
    /// </summary>
    /// <param name="request">JSON containing user info</param>
    /// <response code="200">Returns a user object.</response>
    /// <response code="400">If a user with given email already exists.</response>
    [Authorize(Roles = nameof(ERole.InternshipHandler))]
    [HttpPost("register/internshipHandler")]
    public async Task<ActionResult<UserResDto>> RegisterInternshipHandler(InternshipHandlerRegisterReqDto request)
    {
        var result = await authService.RegisterInternshipHandlerAsync(request);

        if (result.IsFailure)
        {
            return result.ToProblemDetails();
        }
        
        return CreatedAtAction(
            nameof(GetUserById), 
            new { id = result.Value.Id }, 
            result.Value
        );
    }
    
    /// <summary>
    /// Register a company representative handler user.
    /// </summary>
    /// <param name="request">JSON containing user info</param>
    /// <response code="200">Returns a user object.</response>
    /// <response code="400">If a user with given email already exists.</response>
    [Authorize(Roles = nameof(ERole.Student))]
    [HttpPost("register/representative")]
    public async Task<ActionResult<UserResDto>> RegisterCompanyRepresentative(CompanyRepresentativeRegisterReqDto request)
    {
        var result = await authService.RegisterCompanyRepresentativeAsync(request);

        if (result.IsFailure)
        {
            return result.ToProblemDetails();
        }
        
        return CreatedAtAction(
            nameof(GetUserById), 
            new { id = result.Value.Id }, 
            result.Value
        );
    }

    /// <summary>
    /// Login user of the system.
    /// </summary>
    /// <param name="request">JSON containing login email and password</param>
    /// <response code="200">Returns the authentication tokens.</response>
    /// <response code="401">If the email or password were incorrect.</response>
    [HttpPost("login")]
    public async Task<ActionResult<TokenResDto>> Login(LoginReqDto request)
    {
        var result = await authService.LoginAsync(request);

        if (result.IsFailure)
        {
            return result.ToProblemDetails();
        }

        return Ok(result.Value);
    }

    /// <summary>
    /// Refreshing of auth tokens.
    /// </summary>
    /// <param name="request">JSON containing login access and refresh tokens</param>
    /// <response code="200">Returns the authentication tokens.</response>
    /// <response code="401">If there was a problem with tokens.</response>
    [HttpPost("refreshToken")]
    public async Task<ActionResult<TokenResDto>> RefreshTokens(RefreshTokenReqDto request)
    {
        var result = await authService.RefreshTokensAsync(request);

        if (result.IsFailure)
        {
            return result.ToProblemDetails();
        }

        return Ok(result.Value);
    }
    
    /// <summary>
    /// Logout user from the system.
    /// </summary>
    /// <response code="200">Returns success message.</response>
    /// <response code="401">If the user is not authenticated.</response>
    [Authorize]
    [HttpPost("logout")]
    public async Task<ActionResult> Logout()
    {
        // Get user ID from JWT token
        var token = Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
        
        if (token == null)
        {
            return Unauthorized(new { message = "Invalid token" });
        }
        
        
        var result = await authService.LogoutAsync(token);

        if (result.IsFailure)
        {
            return result.ToProblemDetails();
        }

        return Ok(new { message = "Logged out successfully" });
    }

    [Authorize]
    [HttpPost("changeDefaultPassword")]
    public async Task<ActionResult<TokenResDto>> ChangeDefaultPassword(ChangeDefaultPasswordReqDto request)
    {
        request.Email = User.FindFirst(ClaimTypes.Name)?.Value!;

        var result = await authService.ChangeDefaultPassword(request);

        if (result.IsFailure)
        {
            return result.ToProblemDetails();
        }

        return result.Value;
    }


    // TODO This needs to be only accessible to authenticated user (owner)
    [HttpGet("user/{id:guid}")]
    public async Task<ActionResult<UserResDto>> GetUserById(Guid id)
    {
        var result = await authService.GetUserByIdAsync(id);

        if (result.IsFailure)
        {
            return result.ToProblemDetails();
        }

        return Ok(result.Value);
    }
    
    /// <summary>
    /// Initiates password reset flow. Sends an email with reset link if the email exists.
    /// Always returns 200 OK to prevent email enumeration attacks.
    /// </summary>
    /// <param name="request">JSON containing email address of the account</param>
    /// <response code="200">Request processed (email sent if account exists).</response>
    [HttpPost("forgot-password")]
    public async Task<ActionResult> ForgotPassword(ForgotPasswordReqDto request)
    {
        await authService.ForgotPasswordAsync(request);
        
        // Always return 200 to prevent email enumeration
        return Ok(new { message = "If an account with that email exists, a password reset link has been sent." });
    }
    
    /// <summary>
    /// Completes password reset using the token from email.
    /// </summary>
    /// <param name="request">JSON containing reset token and new password</param>
    /// <response code="200">Password was successfully reset.</response>
    /// <response code="400">If the token is invalid, expired, or already used.</response>
    [HttpPost("reset-password")]
    public async Task<ActionResult> ResetPassword(ResetPasswordReqDto request)
    {
        var result = await authService.ResetPasswordAsync(request);

        if (result.IsFailure)
        {
            return result.ToProblemDetails();
        }
        
        return Ok(new { message = "Password has been successfully reset. You can now log in with your new password." });
    }
    
    /// <summary>
    /// [DEPRECATED] Generates a new password for user, which is then sent to the user's mail address.
    /// Use POST /forgot-password and POST /reset-password instead.
    /// </summary>
    /// <param name="request">JSON containing email address of the account requested to reset password</param>
    /// <response code="200">Password reset was successful.</response>
    /// <response code="404">If the user with specified email was not found.</response>
    [Obsolete("Use ForgotPassword and ResetPassword endpoints instead")]
    [HttpPost("resetPassword")]
    public async Task<ActionResult> ResetPasswordLegacy(UserResetPasswordReqDto request)
    {
        #pragma warning disable CS0618
        var result = await authService.ResetUserPasswordAsync(request);
        #pragma warning restore CS0618

        if (result.IsFailure)
        {
            return result.ToProblemDetails();
        }
        
        return Ok();
    }

}
