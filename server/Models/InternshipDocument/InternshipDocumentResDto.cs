using server.Data;

namespace server.Models.InternshipDocument;

public class InternshipDocumentResDto
{
    public Guid Id { get; set; }
    public EDocumentSlot Slot { get; set; }
    public EDocumentUploader UploadedBy { get; set; }
    public string FileName { get; set; } = string.Empty;
    public DateTime UploadedAt { get; set; }
}
