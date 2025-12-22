using System.Security.Claims;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using server.Data;
using server.Entities;
using server.Foundation.Configuration;
using server.Foundation.Result;
using server.Foundation.Utils;
using server.Models.OAuth;

namespace server.Services;

public class ApplicationService(
    ApplicationDbContext context,
    IOptions<AuthConfiguration> authConfiguration,
    IMapper mapper
    ) : IApplicationService
{
    public async Task<Result<ApplicationCreateResDto>> CreateNewApplicationAsync(ApplicationCreateReqDto request)
    {
        // Generate the client secret
        var clientSecret = AuthStatics.GenerateRandomBase64(128);

        // Hash to be saved in the database
        var secretHash = BCrypt.Net.BCrypt.EnhancedHashPassword(clientSecret);

        var newApplication = new ApiApplication
        {
            Name = request.Name,
            ClientId = Guid.NewGuid(),
            ClientSecretHash = secretHash
        };

        // Save new application in database
        await context.Applications.AddAsync(newApplication);
        await context.SaveChangesAsync();

        var response = mapper.Map<ApplicationCreateResDto>(newApplication);
        response.ClientSecret = clientSecret;
        
        return Result<ApplicationCreateResDto>.Success(response);
    }

    public async Task<Result<ApplicationTokenResDto>> GetApplicationTokenAsync(ApplicationTokenReqDto request)
    {
        var application = await context.Applications.FirstOrDefaultAsync(a => a.ClientId == request.ClientId);

        // Application not found
        if (application is null)
        {
            return Result<ApplicationTokenResDto>.Failure(Error.InvalidApplicationCredentials);
        }

        if (!BCrypt.Net.BCrypt.EnhancedVerify(request.ClientSecret, application.ClientSecretHash))
        {
            return Result<ApplicationTokenResDto>.Failure(Error.InvalidApplicationCredentials);
        }

        var token = CreateToken(application.ClientId);
        
        return Result<ApplicationTokenResDto>.Success(new ApplicationTokenResDto
        {
            AccessToken = token,
            // 60 * ExpInMinutes => ExpInSeconds
            ExpiresIn = 60 * authConfiguration.Value.Lifetime.ApplicationToken
        });
    }

    // public async Task<Result<List<ApplicationResDto>>> GetAll()
    // {
    //     var applications = await context.Applications.ToListAsync();
    //     
    //     return Result.Success();
    // }

    private string CreateToken(Guid clientId)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.Role, nameof(ERole.ExternalApplication)),
            new(ClaimTypes.NameIdentifier, clientId.ToString())
        };

        return AuthStatics.CreateToken(
            claims,
            authConfiguration.Value.Issuer,
            authConfiguration.Value.Audience,
            authConfiguration.Value.SigningKey,
            DateTime.UtcNow.AddMinutes(authConfiguration.Value.Lifetime.ApplicationToken)
        );
    }
}