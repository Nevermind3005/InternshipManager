using System.ComponentModel.DataAnnotations;

namespace server.Models.User;

public class UserResDto
{
    [Required]
    public Guid Id { get; set; }
    
    [Required]
    [EmailAddress]
    [MaxLength(256)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MaxLength(32)]
    public string Role { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(128)]
    public string FirstName { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(128)]
    public string LastName { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(20)]
    public string Phone { get; set; } = string.Empty;
    
    /// <summary>
    /// Indicates if the user is a primary representative (can see all company internships).
    /// </summary>
    public bool IsPrimaryRepresentative { get; set; }
    
    /// <summary>
    /// Company ID if the user is a company representative.
    /// </summary>
    public Guid? CompanyId { get; set; }
}