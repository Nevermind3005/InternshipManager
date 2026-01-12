using System.ComponentModel.DataAnnotations;

namespace server.Models.Auth;

/// <summary>
/// Request DTO for completing password reset with token.
/// </summary>
public class ResetPasswordReqDto
{
    private const string PasswordRegex = @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]).{8,}$";
    private const string PasswordErrorMessage = "Heslo musí obsahovať aspoň jedno veľké písmeno, jedno malé písmeno, číslo a špeciálny znak.";

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
    [RegularExpression(PasswordRegex, ErrorMessage = PasswordErrorMessage)]
    public string NewPassword { get; set; } = string.Empty;
}
