using System.ComponentModel.DataAnnotations;

namespace server.Models.Company;

public class CompanyReqDto
{
    [Required]
    [MaxLength(128)]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    public AddressReqDto Address { get; set; } = null!;
}