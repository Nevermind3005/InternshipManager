using System.ComponentModel.DataAnnotations;
using server.Foundation.Utils;

namespace server.Models.User.Student;

public class StudentRegisterReqDto
{
    [Required]
    [MaxLength(256)]
    [RegularExpression(ValidationConstants.StudentEmailRegex)]
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
    [RegularExpression(ValidationConstants.PhoneRegex, ErrorMessage = "Validation.Phone.Invalid")]
    public string Phone { get; set; } = string.Empty;
}