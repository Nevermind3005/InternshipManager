using System.ComponentModel.DataAnnotations;

namespace server.Models.OAuth;

public class ApplicationResDto
{
    [Required]
    [MaxLength(64)]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    public Guid ClientId { get; set; }
}