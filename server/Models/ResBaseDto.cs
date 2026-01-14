using System.ComponentModel.DataAnnotations;

namespace server.Models;

public class ResBaseDto
{
    [Required]
    public Guid Id { get; set; }

    [Required]
    public DateTime CreatedAt { get; set; }
    
    [Required]
    public DateTime UpdatedAt { get; set; }
}