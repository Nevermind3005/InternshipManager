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

    /// <summary>
    /// Indicates if the user is a primary company representative (registered from landing page).
    /// Primary representatives can see all internships for their company.
    /// Regular representatives (created by students) can only see internships assigned to them.
    /// </summary>
    public bool IsPrimaryRepresentative { get; set; } = false;

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