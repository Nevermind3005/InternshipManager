using AutoMapper;
using server.Entities;
using server.Models.User;

namespace server.Profiles;

public class UserProfile : Profile
{
    public UserProfile()
    {
        CreateMap<User, UserResDto>();
    }
}