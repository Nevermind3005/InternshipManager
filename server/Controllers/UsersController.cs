using System.Security.Claims;
using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Foundation.Result;
using server.Models.Auth;
using server.Models.User;
using server.Services;

namespace server.Controllers;

[ApiController]
[ApiVersion(1)]
[Route("api/v{version:apiVersion}/[controller]")]
[Authorize]
public class UsersController(IUserService userService, IAuthService authService) : ControllerBase
{
    [HttpGet("me/personal-information")]
    public async Task<ActionResult<PersonalInformationResDto>> GetPersonalInformation()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId is null || !Guid.TryParse(userId, out var parsedUserId))
        {
            return Unauthorized();
        }

        var result = await userService.GetPersonalInformationAsync(parsedUserId);

        if (result.IsFailure)
        {
            return result.ToProblemDetails();
        }

        return Ok(result.Value);
    }

    [HttpPut("me/personal-information")]
    public async Task<ActionResult> UpdatePersonalInformation(UpdatePersonalInformationReqDto request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId is null || !Guid.TryParse(userId, out var parsedUserId))
        {
            return Unauthorized();
        }

        var result = await userService.UpdatePersonalInformationAsync(parsedUserId, request);

        if (result.IsFailure)
        {
            return result.ToProblemDetails();
        }

        return NoContent();
    }

    [HttpPost("me/change-password")]
    public async Task<ActionResult> ChangePassword(ChangePasswordReqDto request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId is null || !Guid.TryParse(userId, out var parsedUserId))
        {
            return Unauthorized();
        }

        var result = await authService.ChangePasswordAsync(parsedUserId, request);

        if (result.IsFailure)
        {
            return result.ToProblemDetails();
        }

        return NoContent();
    }
}
