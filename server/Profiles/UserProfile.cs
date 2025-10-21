using AutoMapper;
using server.Entities;
using server.Models.User;
using server.Models.User.InternshipHandler;
using server.Models.User.Student;

namespace server.Profiles;

public class UserProfile : Profile
{
    public UserProfile()
    {
        CreateMap<User, UserResDto>();
        CreateMap<StudentRegisterReqDto, User>();
        CreateMap<InternshipHandlerRegisterReqDto, User>();
    }
}