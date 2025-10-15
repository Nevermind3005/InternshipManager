using server.Foundation.Result;
using server.Models.User.Student;

namespace server.Services;

public interface IAuthService
{
    Task<Result> RegisterStudentAsync(StudentRegisterReqDto request);
}