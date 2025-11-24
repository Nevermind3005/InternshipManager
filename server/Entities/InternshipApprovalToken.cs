using System.ComponentModel.DataAnnotations;

namespace server.Entities;

public class InternshipApprovalToken : EntityBase
{
    [Required]
    public Guid InternshipId { get; set; }
    
    public Internship Internship { get; set; } = null!;
    
    [Required]
    [MaxLength(256)]
    public string Token { get; set; } = string.Empty;
    
    [Required]
    public DateTime ExpiresAt { get; set; }
    
    public bool IsUsed { get; set; }
    
    public DateTime? UsedAt { get; set; }
}

