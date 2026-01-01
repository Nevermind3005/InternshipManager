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

        if (userRole is null || userId is null)
        {
            return Problem();
        }
        
        var result = await internshipService.GetInternshipByIdAsync(id);

        if (result.IsFailure)
        {
            return result.ToProblemDetails();
        }

        // Is student and ids don't match
        if (userRole == nameof(ERole.Student) && result.Value.StudentId != new Guid(userId))
        {
            return Forbid();
        }

        return Ok(result.Value);
    }
    
    [HttpGet]
    [Authorize(Roles = $"{nameof(ERole.InternshipHandler)}, {nameof(ERole.CompanyRepresentative)}, {nameof(ERole.Student)}")]
    public async Task<ActionResult<PagedResult<InternshipResDto>>> GetInternships(
            [FromQuery] InternshipFilter filter,
            [FromQuery] int skip = 0,
            [FromQuery] int limit = 25
        )
    {
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (userRole is null || userId is null)
        {
            return Problem();
        }

        if (userRole == nameof(ERole.Student))
        {
            filter.StudentId = new Guid(userId);
        }
        
        var result = await internshipService.GetInternshipsAsync(filter, skip, limit);

        if (result.IsFailure)
        {
            return result.ToProblemDetails();
        }

        return Ok(result.Value);
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