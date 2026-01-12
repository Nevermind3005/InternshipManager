using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using server.Data;

namespace server.Models.Internship;

public class InternshipReqDto
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
    public ESemester Semester;
    
    [JsonIgnore]
    public Guid StudentId { get; set; }

    public Guid CompanyRepresentativeId { get; set; }
    
    public Guid CompanyId { get; set; }
    
    public Guid? StudyProgramId { get; set; }
}