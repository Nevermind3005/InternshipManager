namespace server.Models.Mail;

/// <summary>
/// Model for the password reset email template.
/// </summary>
public class PasswordResetLinkMail
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    
    /// <summary>
    /// The full URL to reset password (includes token).
    /// </summary>
    public string ResetUrl { get; set; } = string.Empty;
    
    /// <summary>
    /// Number of minutes until the token expires.
    /// </summary>
    public int ExpirationMinutes { get; set; }
}
