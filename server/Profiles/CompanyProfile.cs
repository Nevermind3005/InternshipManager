using AutoMapper;
using server.Entities;
using server.Models.Company;

namespace server.Profiles;

public class CompanyProfile : Profile
{
    public CompanyProfile()
    {
        CreateMap<CompanyReqDto, Company>();
        CreateMap<Company, CompanyResDto>();
    }
}