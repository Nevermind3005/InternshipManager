using System.ComponentModel.DataAnnotations;

namespace server.Entities;

public class User : EntityBase
{
    [Required]
    [EmailAddress]
    [MaxLength(256)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MaxLength(256)]
    public string PasswordHash { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(32)]
    public string Role { get; set; } = string.Empty;
    
    public Guid PersonId { get; set; }
    public Person Person { get; set; } = null!;
}