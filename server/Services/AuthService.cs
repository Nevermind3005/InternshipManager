using System.Security.Claims;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.JsonWebTokens;
using server.Data;
using server.Entities;
using server.Foundation.Configuration;
using server.Foundation.Result;
using server.Foundation.Utils;
using server.Models.Auth;
using server.Models.User;
using server.Models.User.Student;
using Wangkanai.Detection.Services;

namespace server.Services;

public class AuthService(
    ApplicationDbContext context,
    IMapper mapper,
    IOptions<AuthConfiguration> authConfiguration,
    IDetectionService detectionService
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
            Role = ERole.Student,
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

    public async Task<Result<TokenResDto>> LoginAsync(LoginReqDto request)
    {
        var user = await context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

        // User not found or invalid password
        if (
            user is null ||
            !BCrypt.Net.BCrypt.EnhancedVerify(request.Password, user.PasswordHash)
            )
        {
            return Result<TokenResDto>.Failure(Error.InvalidCredentials);
        }
        
        var tokens = await CreateTokenResponse(user, "/");
        
        return Result<TokenResDto>.Success(tokens);
    }

    public async Task<Result<TokenResDto>> RefreshTokensAsync(RefreshTokenReqDto request)
    {
        var principal = AuthStatics.GetPrincipalFromExpiredToken(authConfiguration.Value.Issuer, authConfiguration.Value.Audience, authConfiguration.Value.SigningKey, request.AccessToken);

        if (principal is null)
        {
            return Result<TokenResDto>.Failure(Error.InvalidAuthToken);
        }
        
        var userId = principal.FindFirstValue(ClaimTypes.NameIdentifier);
        var tokenId = principal.FindFirstValue(JwtRegisteredClaimNames.Jti);

        if (userId is null || tokenId is null)
        {
            return Result<TokenResDto>.Failure(Error.InvalidAuthToken);
        }

        var result = await RefreshTokensAsync(request.RefreshToken, new Guid(tokenId));
        
        if (result is null)
        {
            return Result<TokenResDto>.Failure(Error.InvalidAuthToken);
        }

        return Result<TokenResDto>.Success(result);
    }

    /// <summary>
    /// Creates a signed JWT token using the provided <see cref="user"/> information.
    /// </summary>
    /// <param name="user">User for whom is the token generated.</param>
    /// <param name="tokenId">Id identifying jwt with a refresh token.</param>
    /// <returns>A signed JWT token string.</returns>
    private string CreateToken(User user, string tokenId)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.Name, user.Email),
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Role, user.Role.ToString()),
            new(JwtRegisteredClaimNames.Jti, tokenId)
        };

        var expiresIn = DateTime.UtcNow.AddMinutes(authConfiguration.Value.Lifetime.AccessToken);
        
        var token = AuthStatics.CreateToken(
            claims,
            authConfiguration.Value.Issuer,
            authConfiguration.Value.Audience,
            authConfiguration.Value.SigningKey,
            expiresIn 
        );

        return token;
    }
    
    private async Task<string> GenerateAndSaveRefreshTokenAsync(User user, Guid jwtId)
    {
        var deviceString =
            $"{detectionService.Platform.Name.ToString()}{detectionService.Platform.Version.ToString()}@{detectionService.Platform.Processor.ToString()} {detectionService.Browser.Name.ToString()}{detectionService.Browser.Version.ToString()}";
        var refreshToken = new RefreshToken
        {
            Token = AuthStatics.GenerateRefreshToken(),
            JwtId = jwtId,
            ExpiresAt = DateTime.UtcNow.AddMinutes(authConfiguration.Value.Lifetime.RefreshToken),
            UserId = user.Id,
            Device = deviceString,
            // TODO add a real IP address
            IpAddress = "UNKNOWN"
        };
        await context.RefreshTokens.AddAsync(refreshToken);
        await context.SaveChangesAsync();
        return refreshToken.Token;
    }
    
    private async Task<TokenResDto?> RefreshTokensAsync(string inRefreshToken, Guid jwtId)
    {
        var refreshToken = await ValidateRefreshTokenAsync(inRefreshToken, jwtId);
        if (refreshToken is null)
        {
            return null;
        }
        
        // Revoke the token used for refresh
        refreshToken.RevokedAt = DateTime.UtcNow;
        await context.SaveChangesAsync();
        
        return await CreateTokenResponse(refreshToken.User, "NONE");
    }
    
    private async Task<RefreshToken?> ValidateRefreshTokenAsync(string inRefreshToken, Guid jwtId)
    {
        var refreshToken = await context.RefreshTokens.Include(rt => rt.User).FirstOrDefaultAsync(rt => rt.Token == inRefreshToken);
        if (
            refreshToken is null || 
            refreshToken.Token != inRefreshToken || 
            refreshToken.ExpiresAt <= DateTime.UtcNow ||
            refreshToken.RevokedAt is not null ||
            refreshToken.JwtId != jwtId
            )
        {
            return null;
        }

        return refreshToken;
    }

    private async Task<TokenResDto> CreateTokenResponse(User user, string redirector)
    {
        var tokenId = Guid.NewGuid();
        var refreshToken = await GenerateAndSaveRefreshTokenAsync(user, tokenId);
        
        var tokens = new TokenResDto
        {
            AccessToken = CreateToken(user, tokenId.ToString()),
            RefreshToken = refreshToken,
            Redirector = redirector
        };

        return tokens;
    }
}