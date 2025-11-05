using AutoMapper;
using server.Entities;
using server.Models.Internship;

namespace server.Profiles;

public class InternshipProfile : Profile
{
    public InternshipProfile()
    {
        CreateMap<InternshipReqDto, Internship>();
        CreateMap<Internship, InternshipResDto>();
    }
}