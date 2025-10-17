using System.ComponentModel.DataAnnotations;

namespace server.Models;

public class AddressReqDto
{
    [Required]
    [MaxLength(128)]
    public string City { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(128)]
    public string Street { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(16)]
    public string BuildingNumber { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(16)]
    public string ZipCode { get; set; } = string.Empty;

}