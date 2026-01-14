using System.ComponentModel.DataAnnotations;
using server.Data;

namespace server.Entities;

public class InternshipDocument : EntityBase
{
    [Required]
    public Guid InternshipId { get; set; }
    public Internship Internship { get; set; } = null!;
    
    [Required]
    public EDocumentSlot Slot { get; set; }
    
    [Required]
    public EDocumentUploader UploadedBy { get; set; }
    
    [Required]
    [MaxLength(256)]
    public string FileName { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(512)]
    public string S3Key { get; set; } = string.Empty;
    
    [Required]
    public DateTime UploadedAt { get; set; }
}
