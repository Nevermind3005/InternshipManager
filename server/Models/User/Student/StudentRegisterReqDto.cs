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
    public AddressReqDto Address { get; set; } = null!;
    
    [Required]
    [MaxLength(128)]
    public string FirstName { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(128)]
    public string LastName { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(20)]
    public string Phone { get; set; } = string.Empty;
}