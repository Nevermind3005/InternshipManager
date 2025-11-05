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
}