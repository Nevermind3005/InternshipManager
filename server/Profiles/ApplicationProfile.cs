using AutoMapper;
using server.Entities;
using server.Models.OAuth;

public class ApplicationProfile : Profile
{
    public ApplicationProfile()
    {
        CreateMap<ApiApplication, ApplicationCreateResDto>();
    }
}