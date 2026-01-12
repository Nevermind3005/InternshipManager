using System.Text.Json.Serialization;
using server.Data;

namespace server.Models.Filters;

public class InternshipFilter
{
    public string? Name { get; set; }
    public int? Year { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Company { get; set; }
    public ESemester? Semester { get; set; }
    public EInternshipState? State { get; set; }
    
    [JsonIgnore]
    public Guid? StudentId { get; set; }
    
    [JsonIgnore]
    public Guid? CompanyRepresentativeId { get; set; }
    
    public Guid? StudyProgramId { get; set; }
}