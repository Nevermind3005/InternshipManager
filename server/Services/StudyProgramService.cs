using AutoMapper;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Entities;
using server.Foundation.Result;
using server.Models.StudyProgram;

namespace server.Services;

public class StudyProgramService(
    ApplicationDbContext context,
    IMapper mapper
) : IStudyProgramService
{
    public async Task<Result<StudyProgramResDto>> CreateAsync(StudyProgramReqDto request)
    {
        // Check if code already exists
        var exists = await context.StudyPrograms.AnyAsync(sp => sp.Code == request.Code);
        if (exists)
        {
            return Result<StudyProgramResDto>.Failure(Error.BadRequest);
        }

        var studyProgram = mapper.Map<StudyProgram>(request);

        await context.StudyPrograms.AddAsync(studyProgram);
        await context.SaveChangesAsync();

        var response = mapper.Map<StudyProgramResDto>(studyProgram);

        return Result<StudyProgramResDto>.Success(response);
    }

    public async Task<Result<List<StudyProgramResDto>>> GetAllAsync()
    {
        var studyPrograms = await context.StudyPrograms
            .OrderBy(sp => sp.Code)
            .ToListAsync();

        var result = mapper.Map<List<StudyProgramResDto>>(studyPrograms);

        return Result<List<StudyProgramResDto>>.Success(result);
    }

    public async Task<Result<StudyProgramResDto>> GetByIdAsync(Guid id)
    {
        var studyProgram = await context.StudyPrograms.FindAsync(id);

        if (studyProgram is null)
        {
            return Result<StudyProgramResDto>.Failure(Error.NotFound);
        }

        var result = mapper.Map<StudyProgramResDto>(studyProgram);

        return Result<StudyProgramResDto>.Success(result);
    }
}
