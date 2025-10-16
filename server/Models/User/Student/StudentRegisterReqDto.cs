using System.ComponentModel.DataAnnotations;

namespace server.Models.User.Student;

public class StudentRegisterReqDto
{
    [Required]
    [MaxLength(256)]
    [RegularExpression(@"^[a-zá-ž]+\.[a-zá-ž]+(\d+)?@student\.ukf\.sk$")]
    public string Email { get; set; } = string.Empty;
    
    [MaxLength(256)]
    [EmailAddress]
    public string? AltMail { get; set; }

    [Required]
    public PersonReqDto Person { get; set; } = null!;
    
    [Required]
    public AddressReqDto Address { get; set; } = null!;
}