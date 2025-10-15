using AutoMapper;
using server.Entities;
using server.Models;

namespace server.Profiles;

public class AddressProfile : Profile
{
    public AddressProfile()
    {
        CreateMap<AddressReqDto, Address>();
    }
}