using System.ComponentModel.DataAnnotations;

namespace server.Models.Auth;

public class LoginReqDto
{
    [Required]
    [EmailAddress]
    [MaxLength(256)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MinLength(8)]
    public string Password { get; set; } = string.Empty;
}