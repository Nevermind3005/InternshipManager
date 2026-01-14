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
using server.Models.InternshipDocument;
using server.Services;

namespace server.Controllers;

[Authorize(Policy = AuthStatics.PolicyNoDefaultPassword)]
[ApiController]
[ApiVersion(1)]
[Route("api/v{version:apiVersion}/[controller]")]
public class InternshipController(
    IInternshipService internshipService,
    IAuthService authService,
    IInternshipDocumentService documentService
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
    
    [HttpGet("export/csv")]
    [Authorize(Roles = nameof(ERole.InternshipHandler))]
    public async Task<IActionResult> ExportInternshipsToCsv([FromQuery] InternshipFilter filter)
    {
        var result = await internshipService.ExportInternshipsToCsvAsync(filter);

        if (result.IsFailure)
        {
            return result.ToProblemDetails();
        }

        var fileName = $"internships_export_{DateTime.Now:yyyy-MM-dd}.csv";
        return File(result.Value, "text/csv; charset=utf-8", fileName);
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
        ChangeInternshipStateAsync(id, EInternshipState.Confirmed, ERole.CompanyRepresentative);

    [HttpPost("{id:guid}/decline")]
    [Authorize(Roles = nameof(ERole.CompanyRepresentative))]
    public Task<ActionResult<InternshipResDto>> DeclineInternship(Guid id) =>
        ChangeInternshipStateAsync(id, EInternshipState.Rejected, ERole.CompanyRepresentative);

    [HttpPost("{id:guid}/handler/approve")]
    [Authorize(Roles = nameof(ERole.InternshipHandler))]
    public Task<ActionResult<InternshipResDto>> HandlerApproveInternship(Guid id) =>
        ChangeInternshipStateAsync(id, EInternshipState.Approved, ERole.InternshipHandler);

    [HttpPost("{id:guid}/handler/reject")]
    [Authorize(Roles = nameof(ERole.InternshipHandler))]
    public Task<ActionResult<InternshipResDto>> HandlerRejectInternship(Guid id) =>
        ChangeInternshipStateAsync(id, EInternshipState.Rejected, ERole.InternshipHandler);

    [HttpPost("{id:guid}/handler/pass")]
    [Authorize(Roles = nameof(ERole.InternshipHandler))]
    public Task<ActionResult<InternshipResDto>> HandlerPassInternship(Guid id) =>
        ChangeInternshipStateAsync(id, EInternshipState.Passed, ERole.InternshipHandler);

    [HttpPost("{id:guid}/handler/fail")]
    [Authorize(Roles = nameof(ERole.InternshipHandler))]
    public Task<ActionResult<InternshipResDto>> HandlerFailInternship(Guid id) =>
        ChangeInternshipStateAsync(id, EInternshipState.Failed, ERole.InternshipHandler);

    private async Task<ActionResult<InternshipResDto>> ChangeInternshipStateAsync(Guid id, EInternshipState newState, ERole editorRole)
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

        // Only check ownership for CompanyRepresentative, InternshipHandler can modify any internship
        if (editorRole == ERole.CompanyRepresentative && internshipResult.Value.CompanyRepresentativeId != userGuid)
        {
            return Forbid();
        }

        var changeResult = await internshipService.ChangeStateAsync(id, newState, editorRole);

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

    #region Document Endpoints

    [HttpGet("{id:guid}/documents")]
    [Authorize(Roles = $"{nameof(ERole.InternshipHandler)}, {nameof(ERole.CompanyRepresentative)}, {nameof(ERole.Student)}")]
    public async Task<ActionResult<InternshipDocumentsStatusResDto>> GetDocumentsStatus(Guid id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId is null || !Guid.TryParse(userId, out var userGuid))
        {
            return Problem();
        }

        var result = await documentService.GetDocumentsStatusAsync(id, userGuid);
        if (result.IsFailure)
        {
            return result.ToProblemDetails();
        }

        return Ok(result.Value);
    }

    [HttpPost("{id:guid}/documents/{slot}")]
    [Authorize(Roles = $"{nameof(ERole.CompanyRepresentative)}, {nameof(ERole.Student)}")]
    public async Task<ActionResult<InternshipDocumentResDto>> UploadDocument(Guid id, EDocumentSlot slot, IFormFile file)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId is null || !Guid.TryParse(userId, out var userGuid))
        {
            return Problem();
        }

        await using var stream = file.OpenReadStream();
        var result = await documentService.UploadDocumentAsync(id, userGuid, slot, stream, file.FileName);
        
        if (result.IsFailure)
        {
            return result.ToProblemDetails();
        }

        return Ok(result.Value);
    }

    [HttpGet("{id:guid}/documents/download/{documentId:guid}")]
    [Authorize(Roles = $"{nameof(ERole.InternshipHandler)}, {nameof(ERole.CompanyRepresentative)}, {nameof(ERole.Student)}")]
    public async Task<IActionResult> DownloadDocument(Guid id, Guid documentId)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId is null || !Guid.TryParse(userId, out var userGuid))
        {
            return Problem();
        }

        var result = await documentService.DownloadDocumentAsync(id, documentId, userGuid);
        if (result.IsFailure)
        {
            return result.ToProblemDetails();
        }

        return File(result.Value.FileStream, result.Value.ContentType, result.Value.FileName);
    }

    [HttpDelete("{id:guid}/documents/{documentId:guid}")]
    [Authorize(Roles = nameof(ERole.Student))]
    public async Task<ActionResult> DeleteDocument(Guid id, Guid documentId)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId is null || !Guid.TryParse(userId, out var userGuid))
        {
            return Problem();
        }

        var result = await documentService.DeleteDocumentAsync(id, documentId, userGuid);
        if (result.IsFailure)
        {
            return result.ToProblemDetails();
        }

        return NoContent();
    }

    [HttpPost("{id:guid}/documents/approve")]
    [Authorize(Roles = nameof(ERole.CompanyRepresentative))]
    public async Task<ActionResult> ApproveDocuments(Guid id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId is null || !Guid.TryParse(userId, out var userGuid))
        {
            return Problem();
        }

        var result = await documentService.ApproveDocumentsAsync(id, userGuid);
        if (result.IsFailure)
        {
            return result.ToProblemDetails();
        }

        return Ok();
    }

    [HttpPost("{id:guid}/documents/reject")]
    [Authorize(Roles = nameof(ERole.CompanyRepresentative))]
    public async Task<ActionResult> RejectDocuments(Guid id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId is null || !Guid.TryParse(userId, out var userGuid))
        {
            return Problem();
        }

        var result = await documentService.RejectDocumentsAsync(id, userGuid);
        if (result.IsFailure)
        {
            return result.ToProblemDetails();
        }

        return Ok();
    }

    [HttpPost("{id:guid}/documents/submit")]
    [Authorize(Roles = nameof(ERole.Student))]
    public async Task<ActionResult> SubmitDocumentsForApproval(Guid id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId is null || !Guid.TryParse(userId, out var userGuid))
        {
            return Problem();
        }

        var result = await documentService.SubmitDocumentsForApprovalAsync(id, userGuid);
        if (result.IsFailure)
        {
            return result.ToProblemDetails();
        }

        return Ok();
    }

    #endregion
}