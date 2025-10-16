using AutoMapper;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Entities;
using server.Foundation.Result;
using server.Foundation.Utils;
using server.Models.User;
using server.Models.User.Student;

namespace server.Services;

public class AuthService(
    ApplicationDbContext context,
    IMapper mapper
    ) : IAuthService
{
    public async Task<Result<UserResDto>> RegisterStudentAsync(StudentRegisterReqDto request)
    {
        // Check if user already exists, if so return failure
        if (await context.Users.AnyAsync(u => u.Email == request.Email))
        {
            return Result<UserResDto>.Failure(Error.UserAlreadyExists);
        }

        // Generate random password and hash it with bCrypt
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

        var dbStudent = await context.Students.AddAsync(student);
        await context.SaveChangesAsync();
        
        // TODO replace with proper password sending via mail
        Console.WriteLine(password);

        // We don't need student info in response
        var response = mapper.Map<UserResDto>(dbStudent.Entity.User);
        
        return Result<UserResDto>.Success(response);
    }

    public async Task<Result<UserResDto>> GetUserByIdAsync(Guid userId)
    {
        var user = await context.Users.Include(u => u.Person).FirstOrDefaultAsync(u => u.Id == userId);

        if (user is null)
        {
            return Result<UserResDto>.Failure(Error.NotFound);
        }

        var response = mapper.Map<UserResDto>(user);
        
        return Result<UserResDto>.Success(response);
    }
}