using server.Data;

namespace server.Models.InternshipDocument;

public class InternshipDocumentsStatusResDto
{
    public EInternshipType InternshipType { get; set; }
    public bool IsSupportingDocsApprovedByCompany { get; set; }
    public bool IsReportApprovedByCompany { get; set; }
    public List<InternshipDocumentResDto> StudentSupportingDocs { get; set; } = new();
    public List<InternshipDocumentResDto> CompanySupportingDocs { get; set; } = new();
    public InternshipDocumentResDto? StudentReport { get; set; }
    public InternshipDocumentResDto? CompanyReport { get; set; }
}
