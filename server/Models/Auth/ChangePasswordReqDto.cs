using System.ComponentModel.DataAnnotations;

namespace server.Models.Auth;

public class ChangePasswordReqDto
{
    private const string PasswordRegex = @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]).{8,}$";
    private const string PasswordErrorMessage = "Heslo musí obsahovať aspoň jedno veľké písmeno, jedno malé písmeno, číslo a špeciálny znak.";

    [Required]
    [MinLength(8)]
    [MaxLength(256)]
    public string CurrentPassword { get; set; } = string.Empty;
    
    [Required]
    [MinLength(8)]
    [MaxLength(256)]
    [RegularExpression(PasswordRegex, ErrorMessage = PasswordErrorMessage)]
    public string NewPassword { get; set; } = string.Empty;
}
