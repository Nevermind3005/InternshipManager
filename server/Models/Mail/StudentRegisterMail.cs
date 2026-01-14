namespace server.Models.Mail;

public class StudentRegisterMail
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string GeneratedPassword { get; set; } = string.Empty;
}