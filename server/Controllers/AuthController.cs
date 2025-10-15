using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;
using server.Foundation.Result;
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
    public async Task<ActionResult> RegisterStudent(StudentRegisterReqDto request)
    {
        var result = await authService.RegisterStudentAsync(request);

        if (result.IsFailure)
        {
            return result.ToProblemDetails();
        }
        
        return Ok();
    }
}
