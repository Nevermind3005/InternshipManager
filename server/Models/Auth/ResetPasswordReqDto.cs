using System.ComponentModel.DataAnnotations;
using server.Foundation.Utils;

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
    [RegularExpression(ValidationConstants.PasswordRegex, ErrorMessage = "Validation.Password.Invalid")]
    public string NewPassword { get; set; } = string.Empty;
}
