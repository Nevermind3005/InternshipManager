using System.ComponentModel.DataAnnotations;

namespace server.Models.Auth;

/// <summary>
/// Request DTO for completing password reset with token.
/// </summary>
public class ResetPasswordReqDto
{
    /// <summary>
    /// The reset token received via email.
    /// </summary>
    [Required]
    public string Token { get; set; } = string.Empty;
    
    /// <summary>
    /// The new password to set.
    /// </summary>
    [Required]
    [MinLength(8)]
    [MaxLength(256)]
    public string NewPassword { get; set; } = string.Empty;
}
