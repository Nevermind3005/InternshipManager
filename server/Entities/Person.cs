using System.ComponentModel.DataAnnotations;

namespace server.Entities;

public class Person : EntityBase
{
    [Required]
    [MaxLength(128)]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [MaxLength(128)]
    public string LastName { get; set; } = string.Empty;

    [MaxLength(20)]
    public string? Phone { get; set; }

    public User User { get; set; } = null!;
}