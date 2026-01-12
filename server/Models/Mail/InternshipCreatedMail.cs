namespace server.Models.Mail;

public class InternshipCreatedMail
{
    public string RepresentativeFirstName { get; set; } = string.Empty;
    public string RepresentativeLastName { get; set; } = string.Empty;
    public string StudentFirstName { get; set; } = string.Empty;
    public string StudentLastName { get; set; } = string.Empty;
    public string StudentEmail { get; set; } = string.Empty;
    public string InternshipName { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public string? StudyProgramCode { get; set; }
}
