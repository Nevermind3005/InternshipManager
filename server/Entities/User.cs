using System.ComponentModel.DataAnnotations;
using server.Data;

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
    public ERole Role { get; set; }
    
    public Guid PersonId { get; set; }
    public Person Person { get; set; } = null!;

    public ICollection<RefreshToken> RefreshTokens = [];
}