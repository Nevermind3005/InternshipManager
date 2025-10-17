using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Foundation.Result;
using server.Models.Auth;
using server.Models.User;
using server.Models.User.Student;
using server.Services;

namespace server.Controllers;

[ApiController]
[ApiVersion(1)]
[Route("api/v{version:apiVersion}/[controller]")]
public class AuthController(
    IAuthService authService
    ) : ControllerBase
{
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
    [HttpGet]
    [Authorize]
    public IActionResult Test()
    {
        return Ok("Authenticated");
    }
}
