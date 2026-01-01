using System.ComponentModel.DataAnnotations;

namespace server.Models.Auth;

public class ChangePasswordReqDto
{
    [Required]
    [MinLength(8)]
    [MaxLength(256)]
    public string CurrentPassword { get; set; } = string.Empty;
    
    [Required]
    [MinLength(8)]
    [MaxLength(256)]
    public string NewPassword { get; set; } = string.Empty;
}
