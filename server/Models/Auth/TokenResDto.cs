using System.ComponentModel.DataAnnotations;

namespace server.Models.Auth;

public class TokenResDto
{
    [Required]
    public string AccessToken { get; set; } = string.Empty;
    
    [Required]
    public string RefreshToken { get; set; } = string.Empty;
    
    [Required]
    public string Redirector { get; set; } = string.Empty;
}