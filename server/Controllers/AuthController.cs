using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;
using server.Foundation.Result;
using server.Models.Auth;
using server.Models.User;
using server.Models.User.Student;
using server.Services;
using Wangkanai.Detection.Services;

namespace server.Controllers;

[ApiController]
[ApiVersion(1)]
[Route("api/v{version:apiVersion}/[controller]")]
public class AuthController(
    IAuthService authService,
    IDetectionService detectionService
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

    // TODO Remove, temp auth testing endpoint
    [HttpGet("test")]
    public IActionResult Test()
    {
        return Ok(detectionService.UserAgent.ToString());
    }
}
