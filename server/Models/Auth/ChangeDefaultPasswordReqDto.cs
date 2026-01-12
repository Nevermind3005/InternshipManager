using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace server.Models.Auth;

public class ChangeDefaultPasswordReqDto
{
    private const string PasswordRegex = @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]).{8,}$";
    private const string PasswordErrorMessage = "Heslo musí obsahovať aspoň jedno veľké písmeno, jedno malé písmeno, číslo a špeciálny znak.";

    [Required]
    [MinLength(8)]
    [MaxLength(256)]
    [RegularExpression(PasswordRegex, ErrorMessage = PasswordErrorMessage)]
    public string Password { get; set; } = string.Empty;

    // Don't expose property to user, We will set this on server
    [JsonIgnore]
    public string Email { get; set; } = string.Empty;
}