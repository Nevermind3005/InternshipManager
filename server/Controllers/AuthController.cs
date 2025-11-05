using System.Security.Claims;
using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Data;
using server.Foundation.Result;
using server.Models.Auth;
using server.Models.User;
using server.Models.User.InternshipHandler;
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
            new { id = result.Value.Id }, 
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
    [Authorize]
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

}
