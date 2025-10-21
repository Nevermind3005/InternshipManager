using System.ComponentModel.DataAnnotations;

namespace server.Models.User.InternshipHandler;

public class InternshipHandlerRegisterReqDto
{
    [Required]
    [MaxLength(256)]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public PersonReqDto Person { get; set; } = null!;
}