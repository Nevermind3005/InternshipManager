using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace server.Controllers;

[ApiController]
[ApiVersion(1)]
[Route("api/v{version:apiVersion}/[controller]")]
public class DocumentController : ControllerBase
{
    private readonly IWebHostEnvironment _environment;
    
    private static readonly Dictionary<string, string[]> AllowedExtensions = new()
    {
        { "report", new[] { ".docx", ".doc" } },
        { "agreement", new[] { ".docx", ".doc" } },
        { "instructions", new[] { ".pdf" } }
    };

    public DocumentController(IWebHostEnvironment environment)
    {
        _environment = environment;
    }

    [Authorize]
    [HttpGet("report")]
    public IActionResult GetReport()
    {
        return GetDocumentFromFolder("report");
    }

    [Authorize]
    [HttpGet("agreement")]
    public IActionResult GetAgreement()
    {
        return GetDocumentFromFolder("agreement");
    }

    [AllowAnonymous]
    [HttpGet("instructions")]
    public IActionResult GetInstructions()
    {
        return GetDocumentFromFolder("instructions");
    }

    private IActionResult GetDocumentFromFolder(string folderName)
    {
        var documentsPath = Path.Combine(_environment.ContentRootPath, "Documents", folderName);

        if (!Directory.Exists(documentsPath))
        {
            return NotFound(new { message = $"Document folder '{folderName}' not found." });
        }

        var allowedExts = AllowedExtensions.GetValueOrDefault(folderName, Array.Empty<string>());
        
        var file = Directory.GetFiles(documentsPath)
            .FirstOrDefault(f => allowedExts.Contains(Path.GetExtension(f).ToLowerInvariant()));

        if (file == null)
        {
            return NotFound(new { message = $"No document found in '{folderName}' folder." });
        }

        var fileName = Path.GetFileName(file);
        var contentType = GetContentType(fileName);
        
        var fileStream = new FileStream(file, FileMode.Open, FileAccess.Read);
        return File(fileStream, contentType, fileName);
    }

    private static string GetContentType(string fileName)
    {
        var extension = Path.GetExtension(fileName).ToLowerInvariant();
        return extension switch
        {
            ".pdf" => "application/pdf",
            ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ".doc" => "application/msword",
            _ => "application/octet-stream"
        };
    }
}
