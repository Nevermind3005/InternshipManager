using System.ComponentModel.DataAnnotations;

namespace server.Models.OAuth;

public class ApplicationCreateReqDto
{
    [Required]
    [MaxLength(64)]
    public string Name { get; set; } = string.Empty;
}