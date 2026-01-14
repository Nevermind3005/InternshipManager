using System.ComponentModel.DataAnnotations;

namespace server.Entities;

/// <summary>
/// Entity for storing password reset tokens.
/// Token is stored as SHA256 hash for security.
/// </summary>
public class PasswordResetToken : EntityBase
{
    /// <summary>
    /// SHA256 hash of the reset token.
    /// The plain token is sent via email and never stored.
    /// </summary>
    [Required]
    [MaxLength(64)] // SHA256 produces 64 character hex string
    public string TokenHash { get; set; } = string.Empty;
    
    /// <summary>
    /// When the token expires.
    /// </summary>
    [Required]
    public DateTime ExpiresAt { get; set; }
    
    /// <summary>
    /// When the token was used. Null if not used yet.
    /// </summary>
    public DateTime? UsedAt { get; set; }
    
    /// <summary>
    /// Whether the token has been revoked (e.g., when a new token is requested).
    /// </summary>
    public bool IsRevoked { get; set; }
    
    /// <summary>
    /// User ID that requested the password reset.
    /// </summary>
    [Required]
    public Guid UserId { get; set; }
    
    /// <summary>
    /// Navigation property to the user.
    /// </summary>
    public User User { get; set; } = null!;
}
