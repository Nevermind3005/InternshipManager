using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using server.Foundation.Utils;

namespace server.Models.Auth;

public class ChangeDefaultPasswordReqDto
{
    [Required]
    [MinLength(8)]
    [MaxLength(256)]
    [RegularExpression(ValidationConstants.PasswordRegex, ErrorMessage = "Validation.Password.Invalid")]
    public string Password { get; set; } = string.Empty;

    // Don't expose property to user, We will set this on server
    [JsonIgnore]
    public string Email { get; set; } = string.Empty;
}