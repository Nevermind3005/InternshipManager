namespace server.Models.Mail;

public class UserResetPasswordMail
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string GeneratedPassword { get; set; }
}