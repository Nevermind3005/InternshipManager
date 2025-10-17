using System.ComponentModel.DataAnnotations;

namespace server.Entities;

public class Student : EntityBase
{
    [MaxLength(256)]
    public string? AltMail { get; set; }
    
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    
    public Address Address { get; set; } = null!;
}