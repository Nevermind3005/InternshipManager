using System.ComponentModel.DataAnnotations;

namespace server.Models.OAuth;

public class ApplicationTokenReqDto
{
    [Required]
    public Guid ClientId { get; set; }
    [Required]
    public string ClientSecret { get; set; } = string.Empty;
}