namespace server.Models.Mail;

public class DocumentsApprovedMail
{
    public string RecipientFirstName { get; set; } = string.Empty;
    public string StudentFirstName { get; set; } = string.Empty;
    public string StudentLastName { get; set; } = string.Empty;
    public string InternshipName { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    public bool AllDocumentsApproved { get; set; }
    public bool SentToCoordinator { get; set; }
}
