using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using server.Data;
using server.Models.Company;
using server.Models.StudyProgram;
using server.Models.User;

namespace server.Models.Internship;

public class InternshipResDto
{
    [Required]
    public Guid Id { get; set; }

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
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public ESemester Semester { get; set; }

    [Required]
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public EInternshipState State { get; set; }
    
    [Required]
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public EInternshipType Type { get; set; }
    
    public bool IsSupportingDocsApprovedByCompany { get; set; }
    public bool IsReportApprovedByCompany { get; set; }
    
    public Guid StudentId { get; set; }
    public UserResDto Student { get; set; } = null!;

    public Guid CompanyRepresentativeId { get; set; }
    public UserResDto CompanyRepresentative { get; set; } = null!;
    
    public Guid CompanyId { get; set; }
    public CompanyResDto Company { get; set; } = null!;
    
    public Guid? StudyProgramId { get; set; }
    public StudyProgramResDto? StudyProgram { get; set; }
}