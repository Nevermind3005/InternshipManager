using System.ComponentModel.DataAnnotations;

namespace server.Models.User.Representative;

public class CompanyRepresentativeRegisterReqDto
{
    [Required]
    public Guid CompanyId { get; set; }
    
    [Required]
    [MaxLength(256)]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MaxLength(128)]
    public string FirstName { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(128)]
    public string LastName { get; set; } = string.Empty;
}