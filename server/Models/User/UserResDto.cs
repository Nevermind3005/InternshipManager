using System.ComponentModel.DataAnnotations;

namespace server.Models.User;

public class UserResDto
{
    [Required]
    public Guid Id { get; set; }
    
    [Required]
    [EmailAddress]
    [MaxLength(256)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MaxLength(32)]
    public string Role { get; set; } = string.Empty;
    
    [Required]
    public PersonResDto Person { get; set; } = null!;
}