using System.ComponentModel.DataAnnotations;

namespace server.Models.User;

public class InternshipHandlerResDto
{
    [Required]
    public Guid Id { get; set; }
    
    [Required]
    [EmailAddress]
    [MaxLength(256)]
    public string Email { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(128)]
    public string FirstName { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(128)]
    public string LastName { get; set; } = string.Empty;
}
