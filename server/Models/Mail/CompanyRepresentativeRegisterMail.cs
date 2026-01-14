namespace server.Models.Mail;

public class CompanyRepresentativeRegisterMail
{
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required string GeneratedPassword { get; set; }
    public required string CompanyName { get; set; }
}
