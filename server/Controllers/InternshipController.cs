using System.Security.Claims;
using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Data;
using server.Foundation.Result;
using server.Foundation.Utils;
using server.Models;
using server.Models.Filters;
using server.Models.Internship;
using server.Services;

namespace server.Controllers;

[Authorize(Policy = AuthStatics.PolicyNoDefaultPassword)]
[ApiController]
[ApiVersion(1)]
[Route("api/v{version:apiVersion}/[controller]")]
public class InternshipController(
    IInternshipService internshipService,
    IAuthService authService
    ) : ControllerBase
{
    [HttpPost]
    [Authorize(Roles = nameof(ERole.Student))]
    public async Task<ActionResult<InternshipResDto>> CreateInternshipAsync(InternshipReqDto request)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (userId is null)
        {
            return Problem();
        }
        
        var user = await authService.GetUserByIdAsync(new Guid(userId));

        if (user.IsFailure)
        {
            return user.ToProblemDetails();
        }

        request.StudentId = user.Value.Id;
        
        var response = await internshipService.CreateInternshipAsync(request);

        if (response.IsFailure)
        {
            return response.ToProblemDetails();
        }

        return CreatedAtAction(
            nameof(GetInternshipsById),
            new { version = HttpContext.GetRequestedApiVersion()?.ToString() ?? "1", id = response.Value.Id }, 
            response.Value
        );
    }

    [HttpGet("{id:guid}")]
    [Authorize(Roles = $"{nameof(ERole.InternshipHandler)}, {nameof(ERole.CompanyRepresentative)}, {nameof(ERole.Student)}")]
    public async Task<ActionResult<InternshipResDto>> GetInternshipsById(Guid id)
    {
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (userRole is null || userId is null || !Guid.TryParse(userId, out var userGuid))
        {
            return Problem();
        }
        
        var result = await internshipService.GetInternshipByIdAsync(id);

        if (result.IsFailure)
        {
            return result.ToProblemDetails();
        }

        if (userRole == nameof(ERole.Student) && result.Value.StudentId != userGuid)
        {
            return Forbid();
        }

        if (userRole == nameof(ERole.CompanyRepresentative) && result.Value.CompanyRepresentativeId != userGuid)
        {
            return Forbid();
        }

        return Ok(result.Value);
    }
    
    [HttpGet]
    [Authorize(Roles = $"{nameof(ERole.InternshipHandler)}, {nameof(ERole.CompanyRepresentative)}, {nameof(ERole.Student)}, {nameof(ERole.ExternalApplication)}")]
    public async Task<ActionResult<PagedResult<InternshipResDto>>> GetInternships(
            [FromQuery] InternshipFilter filter,
            [FromQuery] int skip = 0,
            [FromQuery] int limit = 25
        )
    {
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (userRole is null || userId is null || !Guid.TryParse(userId, out var userGuid))
        {
            return Problem();
        }

        if (User.IsInRole(nameof(ERole.Student)))
        {
            filter.StudentId = userGuid;
        }

        if (userRole == nameof(ERole.CompanyRepresentative))
        {
            filter.CompanyRepresentativeId = userGuid;
        }
        
        var result = await internshipService.GetInternshipsAsync(filter, skip, limit);

        if (result.IsFailure)
        {
            return result.ToProblemDetails();
        }

        return Ok(result.Value);
    }

    [HttpPost("{id:guid}/approve")]
    [Authorize(Roles = nameof(ERole.CompanyRepresentative))]
    public Task<ActionResult<InternshipResDto>> ApproveInternship(Guid id) =>
        ChangeInternshipStateAsync(id, EInternshipState.Confirmed);

    [HttpPost("{id:guid}/decline")]
    [Authorize(Roles = nameof(ERole.CompanyRepresentative))]
    public Task<ActionResult<InternshipResDto>> DeclineInternship(Guid id) =>
        ChangeInternshipStateAsync(id, EInternshipState.Rejected);

    private async Task<ActionResult<InternshipResDto>> ChangeInternshipStateAsync(Guid id, EInternshipState newState)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (userId is null || !Guid.TryParse(userId, out var userGuid))
        {
            return Problem();
        }

        var internshipResult = await internshipService.GetInternshipByIdAsync(id);

        if (internshipResult.IsFailure)
        {
            return internshipResult.ToProblemDetails();
        }

        if (internshipResult.Value.CompanyRepresentativeId != userGuid)
        {
            return Forbid();
        }

        var changeResult = await internshipService.ChangeStateAsync(id, newState);

        if (changeResult.IsFailure)
        {
            return changeResult.ToProblemDetails();
        }

        return Ok(changeResult.Value);
    }
    [HttpPut("{id:guid}")]
    [Authorize(Roles = nameof(ERole.InternshipHandler))]
    public async Task<ActionResult<InternshipResDto>> UpdateInternshipAsync(Guid id, InternshipReqDto request)
    {
        var result = await internshipService.UpdateInternshipAsync(id, request);

        if (result.IsFailure)
        {
            return result.ToProblemDetails();
        }

        return Ok(result.Value);
    }

}