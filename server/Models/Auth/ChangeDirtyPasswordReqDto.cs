using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace server.Models.Auth;

public class ChangeDirtyPasswordReqDto
{
    [Required]
    [MinLength(8)]
    public string Password { get; set; } = string.Empty;

    // Don't expose property to user, We will set this on server
    [JsonIgnore]
    public string Email { get; set; } = string.Empty;
}