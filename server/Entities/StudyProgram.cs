using System.ComponentModel.DataAnnotations;

namespace server.Entities;

public class StudyProgram : EntityBase
{
    [Required]
    [MaxLength(16)]
    public string Code { get; set; } = string.Empty;
    
    public List<Internship> Internships { get; set; } = [];
}
