namespace server.Models.Mail;

public class InternshipConfirmedForCoordinatorMail
{
    public string StudentFirstName { get; set; } = string.Empty;
    public string StudentLastName { get; set; } = string.Empty;
    public string StudentEmail { get; set; } = string.Empty;
    public string? StudentPhone { get; set; }
    public string? StudyProgramCode { get; set; }
    public string InternshipName { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    public string CompanyRepresentativeName { get; set; } = string.Empty;
    public string CompanyRepresentativeEmail { get; set; } = string.Empty;
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public int Year { get; set; }
    public string Semester { get; set; } = string.Empty;
}
