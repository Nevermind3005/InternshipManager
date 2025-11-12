using System.ComponentModel.DataAnnotations;
using server.Models;

namespace server.Models.User;

public class PersonalInformationResDto
{
    [Required]
    [MaxLength(128)]
    public string FirstName { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(128)]
    public string LastName { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(20)]
    public string Phone { get; set; } = string.Empty;
    
    [Required]
    public AddressResDto Address { get; set; } = new();
}

