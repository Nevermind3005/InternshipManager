using System.ComponentModel.DataAnnotations;
using server.Data;

namespace server.Entities;

public class Internship : EntityBase
{
    [Required]
    [MaxLength(128)]
    public string Name { get; set; } = string.Empty;
    
    [MaxLength(1024)]
    public string? Description { get; set; }
    
    [Required]
    public DateOnly StartDate { get; set; }
    
    [Required]
    public DateOnly EndDate { get; set; }
    
    [Required]
    [Range(2024, 2100)]
    public int Year { get; set; }

    [Required]
    public ESemester Semester { get; set; }

    [Required]
    public EInternshipState State { get; set; }
    
    public Guid StudentId { get; set; }
    public User Student { get; set; } = null!;

    public Guid CompanyRepresentativeId { get; set; }
    public User CompanyRepresentative { get; set; } = null!;
    
    public Guid CompanyId { get; set; }
    public Company Company { get; set; } = null!;
    
    public Guid? StudyProgramId { get; set; }
    public StudyProgram? StudyProgram { get; set; }
}