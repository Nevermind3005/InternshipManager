using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace server.Entities;

// TODO: Make into normal table?????
[Owned]
public class Address
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