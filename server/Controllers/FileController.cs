using System.Security.Claims;
using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Data;
using server.Foundation.Result;
using server.Models;
using server.Services;

namespace server.Controllers;

[ApiController]
[ApiVersion(1)]
[Route("api/v{version:apiVersion}/[controller]")]
public class FileController(
    IS3Service s3Service
    ) : ControllerBase
{
    
    [Authorize(Roles = $"{nameof(ERole.CompanyRepresentative)}, {nameof(ERole.Student)}")]
    [HttpPost("upload")]
    public async Task<ActionResult<FileUploadResDto>> Upload(IFormFile file)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (userId is null)
        {
            return Problem();
        }
        
        await using var stream = file.OpenReadStream();
        var res = await s3Service.UploadFileAsync(stream, new Guid(userId), file.FileName);

        if (res.IsFailure)
        {
            return res.ToProblemDetails();
        }
        
        return Ok(res.Value);
    }

    [Authorize]
    [HttpGet("download/{**fileName}")]
    public async Task<IActionResult> Download([FromRoute] string fileName)
    {
        var response = await s3Service.DownloadFileAsync(fileName);
        return File(response.FileStream, response.ContentType, fileName);
    }
}