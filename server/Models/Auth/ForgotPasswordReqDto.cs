using System.ComponentModel.DataAnnotations;

namespace server.Models.Auth;

/// <summary>
/// Request DTO for initiating password reset flow.
/// </summary>
public class ForgotPasswordReqDto
{
    /// <summary>
    /// Email address of the account to reset password for.
    /// </summary>
    [Required]
    [EmailAddress]
    [MaxLength(256)]
    public string Email { get; set; } = string.Empty;
}
