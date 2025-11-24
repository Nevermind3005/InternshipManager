using AutoMapper;
using server.Entities;
using server.Models;
using server.Models.User;
using server.Models.User.InternshipHandler;
using server.Models.User.Representative;
using server.Models.User.Student;

namespace server.Profiles;

public class UserProfile : Profile
{
    public UserProfile()
    {
        CreateMap<User, UserResDto>();
        CreateMap<StudentRegisterReqDto, User>();
        CreateMap<InternshipHandlerRegisterReqDto, User>();
        CreateMap<User, PersonalInformationResDto>()
            .ForMember(dest => dest.Phone, opt => opt.MapFrom(src => src.Phone ?? string.Empty))
            .ForMember(dest => dest.Address, opt => opt.MapFrom(src => src.Address ?? new Address()));
        CreateMap<UpdatePersonalInformationReqDto, User>()
            .ForMember(dest => dest.Address, opt => opt.Ignore())
            .ForMember(dest => dest.Phone, opt => opt.MapFrom(src => src.Phone));
        CreateMap<CompanyRepresentativeRegisterReqDto, User>();
    }
}