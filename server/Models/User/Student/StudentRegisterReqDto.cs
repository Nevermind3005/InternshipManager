using System.ComponentModel.DataAnnotations;

namespace server.Models.User.Student;

public class StudentRegisterReqDto
{
    private const string PhoneRegex = @"^\+?[0-9]{6,19}$";
    private const string PhoneErrorMessage = "Telefónne číslo môže obsahovať len čísla a znak +.";

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
    [RegularExpression(PhoneRegex, ErrorMessage = PhoneErrorMessage)]
    public string Phone { get; set; } = string.Empty;
}