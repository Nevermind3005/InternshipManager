using System.ComponentModel.DataAnnotations;

namespace server.Entities;

public class Company : EntityBase
{
    [Required]
    [MaxLength(128)]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    public Address Address { get; set; } = null!;

    public List<User> Representatives { get; set; } = [];

    public List<Internship> Internships { get; set; } = [];
}