using System.ComponentModel.DataAnnotations;

namespace server.Models.Auth;

public class RefreshTokenReqDto
{
    [Required]
    public string AccessToken { get; set; } = string.Empty;
    [Required]
    public string RefreshToken { get; set; } = string.Empty;
}