using System.ComponentModel.DataAnnotations;

namespace server.Entities;

public class ApiApplication : EntityBase
{
    [Required]
    [MaxLength(64)]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    public Guid ClientId { get; set; }

    [Required]
    [MaxLength(128)]
    public string ClientSecretHash { get; set; } = string.Empty;
}