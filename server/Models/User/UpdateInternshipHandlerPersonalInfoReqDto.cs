using System.ComponentModel.DataAnnotations;

namespace server.Models.User;

public class UpdateInternshipHandlerPersonalInfoReqDto
{
    [Required]
    [MaxLength(128)]
    public string FirstName { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(128)]
    public string LastName { get; set; } = string.Empty;
}

