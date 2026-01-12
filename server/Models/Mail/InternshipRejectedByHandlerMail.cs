namespace server.Models.Mail;

public class InternshipRejectedByHandlerMail
{
    public string StudentFirstName { get; set; } = string.Empty;
    public string StudentLastName { get; set; } = string.Empty;
    public string InternshipName { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
}
