using System.ComponentModel.DataAnnotations;

namespace server.Models.StudyProgram;

public class StudyProgramReqDto
{
    [Required]
    [MaxLength(16)]
    public string Code { get; set; } = string.Empty;
}
