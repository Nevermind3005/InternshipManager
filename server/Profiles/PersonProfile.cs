using AutoMapper;
using server.Entities;
using server.Models.User;

namespace server.Profiles;

public class PersonProfile : Profile
{
    public PersonProfile()
    {
        CreateMap<PersonReqDto, Person>();
    }
}