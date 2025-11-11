using System.Security.Claims;
using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Data;
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
    public async Task<IActionResult> Upload(IFormFile file)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (userId is null)
        {
            return Problem();
        }
        
        await using var stream = file.OpenReadStream();
        await s3Service.UploadFileAsync(stream, new Guid(userId), file.FileName);
        return Ok("Ok");
    }

    [Authorize]
    [HttpGet("download/{**fileName}")]
    public async Task<IActionResult> Download([FromRoute] string fileName)
    {
        var response = await s3Service.DownloadFileAsync(fileName);
        return File(response.FileStream, response.ContentType, fileName);
    }
}