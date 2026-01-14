using System.ComponentModel.DataAnnotations;
using server.Models;

namespace server.Models.Company;

/// <summary>
/// DTO for registering a company with a primary representative from the landing page.
/// </summary>
public class CompanyWithRepresentativeRegisterReqDto
{
    /// <summary>
    /// If set, the representative will be added to an existing company.
    /// If null, a new company will be created.
    /// </summary>
    public Guid? CompanyId { get; set; }
    
    /// <summary>
    /// Company name. Required only if CompanyId is null (creating new company).
    /// </summary>
    [MaxLength(128)]
    public string? CompanyName { get; set; }
    
    /// <summary>
    /// Company address. Required only if CompanyId is null (creating new company).
    /// </summary>
    public AddressReqDto? CompanyAddress { get; set; }
    
    // Representative information
    [Required]
    [EmailAddress]
    [MaxLength(256)]
    public string Email { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(128)]
    public string FirstName { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(128)]
    public string LastName { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(20)]
    public string Phone { get; set; } = string.Empty;
}
