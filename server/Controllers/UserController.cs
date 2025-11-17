using System.Security.Claims;
using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Data;
using server.Foundation.Result;
using server.Models.Auth;
using server.Models.User;
using server.Services;

namespace server.Controllers;

[ApiController]
[ApiVersion(1)]
[Route("api/v{version:apiVersion}/[controller]")]
[Authorize]
public class UserController(IUserService userService, IAuthService authService) : ControllerBase
{
    [HttpGet("me/personalInformation")]
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

    [HttpPut("me/personalInformation")]
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

    [HttpPost("me/changePassword")]
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

    [HttpPut("me/personalInformation/internshipHandler")]
    [Authorize(Roles = nameof(ERole.InternshipHandler))]
    public async Task<ActionResult> UpdateInternshipHandlerPersonalInfo(UpdateInternshipHandlerPersonalInfoReqDto request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId is null || !Guid.TryParse(userId, out var parsedUserId))
        {
            return Unauthorized();
        }

        var result = await userService.UpdateInternshipHandlerPersonalInfoAsync(parsedUserId, request);

        if (result.IsFailure)
        {
            return result.ToProblemDetails();
        }

        return NoContent();
    }

    [HttpPut("me/personalInformation/companyRepresentative")]
    [Authorize(Roles = nameof(ERole.CompanyRepresentative))]
    public async Task<ActionResult> UpdateCompanyRepresentativePersonalInfo(UpdateCompanyRepresentativePersonalInfoReqDto request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId is null || !Guid.TryParse(userId, out var parsedUserId))
        {
            return Unauthorized();
        }

        var result = await userService.UpdateCompanyRepresentativePersonalInfoAsync(parsedUserId, request);

        if (result.IsFailure)
        {
            return result.ToProblemDetails();
        }

        return NoContent();
    }
}
