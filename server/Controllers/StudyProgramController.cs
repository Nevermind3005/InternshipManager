using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Data;
using server.Foundation.Result;
using server.Foundation.Utils;
using server.Models.StudyProgram;
using server.Services;

namespace server.Controllers;

[Authorize(Policy = AuthStatics.PolicyNoDefaultPassword)]
[ApiController]
[ApiVersion(1)]
[Route("api/v{version:apiVersion}/[controller]")]
public class StudyProgramController(
    IStudyProgramService studyProgramService
) : ControllerBase
{
    /// <summary>
    /// Creates a new study program. Only InternshipHandler can create study programs.
    /// </summary>
    [HttpPost]
    [Authorize(Roles = nameof(ERole.InternshipHandler))]
    public async Task<ActionResult<StudyProgramResDto>> CreateStudyProgram(StudyProgramReqDto request)
    {
        var result = await studyProgramService.CreateAsync(request);

        if (result.IsFailure)
        {
            return result.ToProblemDetails();
        }

        return CreatedAtAction(
            nameof(GetStudyProgramById),
            new { version = HttpContext.GetRequestedApiVersion()?.ToString() ?? "1", id = result.Value.Id },
            result.Value
        );
    }

    /// <summary>
    /// Gets all study programs. Used for dropdown selection.
    /// </summary>
    [HttpGet]
    [Authorize(Roles = $"{nameof(ERole.InternshipHandler)}, {nameof(ERole.CompanyRepresentative)}, {nameof(ERole.Student)}")]
    public async Task<ActionResult<List<StudyProgramResDto>>> GetAllStudyPrograms()
    {
        var result = await studyProgramService.GetAllAsync();

        if (result.IsFailure)
        {
            return result.ToProblemDetails();
        }

        return Ok(result.Value);
    }

    /// <summary>
    /// Gets a study program by ID.
    /// </summary>
    [HttpGet("{id:guid}")]
    [Authorize(Roles = $"{nameof(ERole.InternshipHandler)}, {nameof(ERole.CompanyRepresentative)}, {nameof(ERole.Student)}")]
    public async Task<ActionResult<StudyProgramResDto>> GetStudyProgramById(Guid id)
    {
        var result = await studyProgramService.GetByIdAsync(id);

        if (result.IsFailure)
        {
            return result.ToProblemDetails();
        }

        return Ok(result.Value);
    }
}
