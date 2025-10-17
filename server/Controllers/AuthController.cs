using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;
using server.Foundation.Result;
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
