using System.ComponentModel.DataAnnotations;

namespace server.Models.User.InternshipHandler;

public class InternshipHandlerRegisterReqDto
{
    [Required]
    [MaxLength(256)]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MaxLength(128)]
    public string FirstName { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(128)]
    public string LastName { get; set; } = string.Empty;
}