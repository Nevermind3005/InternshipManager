using System.ComponentModel.DataAnnotations;

namespace server.Models.OAuth;

public class ApplicationCreateResDto
{
    [Required]
    public Guid Id { get; set; }
    
    [Required]
    [MaxLength(64)]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    public Guid ClientId { get; set; }

    [Required]
    [MaxLength(128)]
    public string ClientSecret { get; set; } = string.Empty;
}