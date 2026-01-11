namespace server.Models.Mail;

public class UserResetPasswordMail
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string GeneratedPassword { get; set; } = string.Empty;
}