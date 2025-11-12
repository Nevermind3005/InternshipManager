using AutoMapper;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Entities;
using server.Foundation.Result;
using server.Models;
using server.Models.User;

namespace server.Services;

public class UserService(
    ApplicationDbContext context,
    IMapper mapper
    ) : IUserService
{
    public async Task<Result<PersonalInformationResDto>> GetPersonalInformationAsync(Guid userId)
    {
        var user = await context.Users
            .AsNoTracking()
            .Include(u => u.Address)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user is null)
        {
            return Result<PersonalInformationResDto>.Failure(Error.NotFound);
        }

        var address = user.Address is null
            ? new AddressResDto()
            : mapper.Map<AddressResDto>(user.Address);

        var response = new PersonalInformationResDto
        {
            FirstName = user.FirstName,
            LastName = user.LastName,
            Phone = user.Phone ?? string.Empty,
            Address = address
        };

        return Result<PersonalInformationResDto>.Success(response);
    }

    public async Task<Result> UpdatePersonalInformationAsync(Guid userId, UpdatePersonalInformationReqDto request)
    {
        var user = await context.Users
            .Include(u => u.Address)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user is null)
        {
            return Result.Failure(Error.NotFound);
        }

        user.FirstName = request.FirstName;
        user.LastName = request.LastName;
        user.Phone = request.Phone;

        if (user.Address is null)
        {
            user.Address = mapper.Map<Address>(request.Address);
        }
        else
        {
            mapper.Map(request.Address, user.Address);
        }

        await context.SaveChangesAsync();

        return Result.Success();
    }
}
