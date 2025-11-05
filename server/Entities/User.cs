using System.ComponentModel.DataAnnotations;
using server.Data;

namespace server.Entities;

public class User : EntityBase
{
    [Required]
    [EmailAddress]
    [MaxLength(256)]
    public string Email { get; set; } = string.Empty;
    
    [MaxLength(256)]
    public string? AltMail { get; set; }

    [Required]
    [MaxLength(256)]
    public string PasswordHash { get; set; } = string.Empty;
    
    [Required]
    public bool IsPasswordDirty { get; set; }
    
    [Required]
    public ERole Role { get; set; }

    [Required]
    [MaxLength(128)]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [MaxLength(128)]
    public string LastName { get; set; } = string.Empty;

    [MaxLength(20)]
    public string? Phone { get; set; }
    
    public Address? Address { get; set; } = null;

    public Guid? CompanyId { get; set; }

    public List<Internship> StudentInternships = [];
    
    public List<Internship> RepresentativeInternships = [];
    
    public ICollection<RefreshToken> RefreshTokens = [];
}