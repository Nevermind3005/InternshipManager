using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Data;
using server.Foundation.Result;
using server.Foundation.Utils;
using server.Models.Company;
using server.Services;

namespace server.Controllers;

[Authorize(Policy = AuthStatics.PolicyNoDefaultPassword)]
[ApiController]
[ApiVersion(1)]
[Route("api/v{version:apiVersion}/[controller]")]
public class CompanyController(
    ICompanyService companyService
    ) : ControllerBase
{
    [HttpPost]
    [Authorize(Roles = nameof(ERole.Student))]
    public async Task<ActionResult<CompanyResDto>> CreateCompanyAsync(CompanyReqDto request)
    {
        var response = await companyService.CreateCompanyAsync(request);

        if (response.IsFailure)
        {
            return response.ToProblemDetails();
        }

        return CreatedAtAction(
            nameof(GetCompanyById),
            new { version = HttpContext.GetRequestedApiVersion()?.ToString() ?? "1", id = response.Value.Id }, 
            response.Value
        );
    }
    
    [HttpGet("{id:guid}")]
    [Authorize(Roles = $"{nameof(ERole.InternshipHandler)}, {nameof(ERole.Student)}")]
    public async Task<ActionResult<CompanyResDto>> GetCompanyById(Guid id)
    {
        var result = await companyService.GetCompanyByIdAsync(id);

        if (result.IsFailure)
        {
            return result.ToProblemDetails();
        }

        return Ok(result.Value);
    }
    
    [HttpGet]
    [Authorize(Roles = $"{nameof(ERole.InternshipHandler)}, {nameof(ERole.Student)}")]
    public async Task<ActionResult<CompanyResDto>> GetCompanies()
    {
        var result = await companyService.GetCompaniesAsync();

        if (result.IsFailure)
        {
            return result.ToProblemDetails();
        }

        return Ok(result.Value);
    }

    /// <summary>
    /// Get all companies (public endpoint for company registration form).
    /// </summary>
    [HttpGet("public")]
    [AllowAnonymous]
    public async Task<ActionResult<CompanyResDto>> GetCompaniesPublic()
    {
        var result = await companyService.GetCompaniesAsync();

        if (result.IsFailure)
        {
            return result.ToProblemDetails();
        }

        return Ok(result.Value);
    }
    
    [HttpGet("{id:guid}/representative/{email}")]
    [Authorize(Roles = $"{nameof(ERole.InternshipHandler)}, {nameof(ERole.Student)}")]
    public async Task<ActionResult<CompanyResDto>> GetCompanyRepresentative(Guid id, string email)
    {
        var result = await companyService.GetCompanyRepresentativeByEmail(id, email);

        if (result.IsFailure)
        {
            return result.ToProblemDetails();
        }

        return Ok(result.Value);
    }

}