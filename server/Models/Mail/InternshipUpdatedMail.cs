namespace server.Models.Mail;

public class InternshipUpdatedMail
{
    public string StudentFirstName { get; set; } = string.Empty;
    public string StudentLastName { get; set; } = string.Empty;
    public string InternshipName { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public int Year { get; set; }
    public string Semester { get; set; } = string.Empty;
    public string? StudyProgramCode { get; set; }
}
