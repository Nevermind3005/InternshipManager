using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Data;
using server.Foundation.Result;
using server.Models;
using server.Models.OAuth;
using server.Services;

namespace server.Controllers;

/// <summary>
/// Controller for management of external applications.
/// </summary>
[ApiController]
[ApiVersion(1)]
[Route("api/v{version:apiVersion}/[controller]")]
public class OAuthController(
    IApplicationService applicationService
    ) : ControllerBase
{
    
    /// <summary>
    /// Register a new external application.
    /// </summary>
    /// <param name="request">JSON containing name of the new external application</param>
    /// <response code="200">Returns the name, clientId and clientSecret.</response>
    [Authorize(Roles = nameof(ERole.InternshipHandler))]
    [HttpPost("createApplication")]
    public async Task<ActionResult<ApplicationCreateResDto>> CreateApiApplication(ApplicationCreateReqDto request)
    {
        var result = await applicationService.CreateNewApplicationAsync(request);

        if (result.IsFailure)
        {
            return result.ToProblemDetails();
        }

        return Ok(result.Value);
    }

    /// <summary>
    /// Get all external applications.
    /// </summary>
    /// <response code="200">Returns paged result with all external applications.</response>
    [Authorize(Roles = nameof(ERole.InternshipHandler))]
    [HttpGet("applications")]
    public async Task<ActionResult<PagedResult<ApplicationResDto>>> GetAllApplications(
        [FromQuery] int skip = 0,
        [FromQuery] int limit = 25
        )
    {
        var result = await applicationService.GetAllApplicationsAsync(skip, limit);

        if (result.IsFailure)
        {
            return result.ToProblemDetails();
        }

        return Ok(result.Value);
    }

    /// <summary>
    /// Get authentication token for external application.
    /// </summary>
    /// <param name="request">JSON containing the clientId and clientSecret of the external application</param>
    /// <response code="200">Returns the accessToken, tokenType and expiration in seconds.</response>
    /// <response code="401">If clientId or secret is invalid.</response>
    [HttpPost("token")]
    public async Task<ActionResult<ApplicationTokenResDto>> GetApplicationToken(ApplicationTokenReqDto request)
    {
        var result = await applicationService.GetApplicationTokenAsync(request);

        if (result.IsFailure)
        {
            return result.ToProblemDetails();
        }

        return Ok(result.Value);
    }
}