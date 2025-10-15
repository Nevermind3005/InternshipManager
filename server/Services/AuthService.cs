using AutoMapper;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Entities;
using server.Foundation.Result;
using server.Foundation.Utils;
using server.Models.User.Student;

namespace server.Services;

public class AuthService(
    ApplicationDbContext context,
    IMapper mapper
    ) : IAuthService
{
    public async Task<Result> RegisterStudentAsync(StudentRegisterReqDto request)
    {
        if (await context.Users.AnyAsync(u => u.Email == request.Email))
        {
            return Result.Failure(Error.UserAlreadyExists);
        }

        var password = AuthStatics.GenerateRandomPassword();
        var passwordHash = BCrypt.Net.BCrypt.EnhancedHashPassword(password);

        var person = mapper.Map<Person>(request.Person);
        
        var user = new User
        {
            PasswordHash = passwordHash,
            Email = request.Email,
            Role = Roles.RoleStudent,
            Person = person
        };

        var address = mapper.Map<Address>(request.Address);

        var student = new Student
        {
            AltMail = request.AltMail,
            Address = address,
            User = user
        };

        await context.Students.AddAsync(student);
        await context.SaveChangesAsync();
        
        Console.WriteLine(password);
        
        return Result.Success();
    }
}