using server.Foundation.Result;
using server.Models.User;

namespace server.Services;

public interface IUserService
{
    Task<Result<PersonalInformationResDto>> GetPersonalInformationAsync(Guid userId);
    Task<Result> UpdatePersonalInformationAsync(Guid userId, UpdatePersonalInformationReqDto request);
}

