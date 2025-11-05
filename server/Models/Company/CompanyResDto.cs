using System.ComponentModel.DataAnnotations;

namespace server.Models.Company;

public class CompanyResDto : ResBaseDto
{
    [Required]
    [MaxLength(128)]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    public AddressResDto Address { get; set; } = null!;
}