using System.ComponentModel.DataAnnotations;

namespace server.Models.Auth;

public class UserResetPasswordReqDto
{
    [EmailAddress] [Required] public string Email { get; set; } = string.Empty;
}