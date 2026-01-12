using System.ComponentModel.DataAnnotations;

namespace server.Models.User;

public class UpdateCompanyRepresentativePersonalInfoReqDto
{
    private const string PhoneRegex = @"^\+?[0-9]{6,19}$";
    private const string PhoneErrorMessage = "Telefónne číslo môže obsahovať len čísla a znak +.";

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

