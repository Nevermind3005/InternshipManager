using System.ComponentModel.DataAnnotations;

namespace server.Entities;

public class RefreshToken : EntityBase
{
    [Required]
    [MaxLength(256)]
    public string Token { get; set; } = string.Empty;
    [Required]
    public Guid JwtId { get; set; }
    
    [Required]
    public DateTime ExpiresAt { get; set; }
    public DateTime? RevokedAt { get; set; }
    
    [MaxLength(256)]
    public string? Device { get; set; }
    [MaxLength(39)]
    public string? IpAddress { get; set; }
    
    [Required]
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
}