using AutoMapper;
using server.Entities;
using server.Models.StudyProgram;

namespace server.Profiles;

public class StudyProgramProfile : Profile
{
    public StudyProgramProfile()
    {
        CreateMap<StudyProgramReqDto, StudyProgram>();
        CreateMap<StudyProgram, StudyProgramResDto>();
    }
}
