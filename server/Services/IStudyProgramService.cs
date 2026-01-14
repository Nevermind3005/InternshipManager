using server.Foundation.Result;
using server.Models.StudyProgram;

namespace server.Services;

public interface IStudyProgramService
{
    Task<Result<StudyProgramResDto>> CreateAsync(StudyProgramReqDto request);
    Task<Result<List<StudyProgramResDto>>> GetAllAsync();
    Task<Result<StudyProgramResDto>> GetByIdAsync(Guid id);
}
