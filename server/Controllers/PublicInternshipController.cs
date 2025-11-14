using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Data;
using server.Foundation.Result;
using server.Models.Internship;
using server.Services;

namespace server.Controllers;

[AllowAnonymous]
[ApiController]
[ApiVersion(1)]
[Route("api/v{version:apiVersion}/[controller]")]
public class PublicInternshipController(
    IInternshipService internshipService
    ) : ControllerBase
{
    [HttpGet("view/{id:guid}")]
    public async Task<ActionResult<InternshipResDto>> ViewInternshipById(Guid id)
    {
        var result = await internshipService.GetInternshipByIdAsync(id);

        if (result.IsFailure)
        {
            return result.ToProblemDetails();
        }

        return Ok(result.Value);
    }

    [HttpPost("view/{id:guid}/approve")]
    public async Task<ActionResult<InternshipResDto>> ApproveInternship(Guid id)
    {
        var result = await internshipService.ChangeStateAsync(id, EInternshipState.Confirmed);

        if (result.IsFailure)
        {
            return result.ToProblemDetails();
        }

        return Ok(result.Value);
    }

    [HttpPost("view/{id:guid}/decline")]
    public async Task<ActionResult<InternshipResDto>> DeclineInternship(Guid id)
    {
        var result = await internshipService.ChangeStateAsync(id, EInternshipState.Rejected);

        if (result.IsFailure)
        {
            return result.ToProblemDetails();
        }

        return Ok(result.Value);
    }
}

