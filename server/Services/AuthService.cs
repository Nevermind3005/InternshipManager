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
using server.Models.Mail;
using server.Models.User;
using server.Models.User.InternshipHandler;
using server.Models.User.Representative;
using server.Models.User.Student;
using Wangkanai.Detection.Services;

namespace server.Services;

public class AuthService(
    ApplicationDbContext context,
    IMapper mapper,
    IOptions<AuthConfiguration> authConfiguration,
    IDetectionService detectionService,
    IMailService mailService,
    IConfiguration configuration,
    ILogger<AuthService> logger
    ) : IAuthService
{
    private readonly AuthConfiguration _authConfig = authConfiguration.Value;
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

        var user = mapper.Map<User>(request);
        user.PasswordHash = passwordHash;
        user.Role = ERole.Student;
        user.IsPasswordDirty = true;

        var dbUser = await context.Users.AddAsync(user);
        await context.SaveChangesAsync();
        
        var mailTemplateModel = new StudentRegisterMail
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            GeneratedPassword = password
        };

        await mailService.SendMailTemplateAsync(request.Email, "Password","Templates/StudentRegisterMail.cshtml", mailTemplateModel);
        
        if (request.AltMail is not null)
        {
            await mailService.SendMailTemplateAsync(request.AltMail, "Password", "Templates/StudentRegisterMail.cshtml",
                mailTemplateModel);
        }

        var response = mapper.Map<UserResDto>(dbUser.Entity);
        
        return Result<UserResDto>.Success(response);
    }

    public async Task<Result<UserResDto>> RegisterInternshipHandlerAsync(InternshipHandlerRegisterReqDto request)
    {
        // Check if user already exists, if so return failure
        if (await context.Users.AnyAsync(u => u.Email == request.Email))
        {
            return Result<UserResDto>.Failure(Error.UserAlreadyExists);
        }

        // Generate random password and hash it with bCrypt
        var password = AuthStatics.GenerateRandomPassword();
        var passwordHash = BCrypt.Net.BCrypt.EnhancedHashPassword(password);

        var user = mapper.Map<User>(request);
        user.PasswordHash = passwordHash;
        user.Role = ERole.InternshipHandler;
        user.IsPasswordDirty = true;
        
        var dbUser = await context.Users.AddAsync(user);
        await context.SaveChangesAsync();
        
        var mailTemplateModel = new StudentRegisterMail
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            GeneratedPassword = password
        };
        
        await mailService.SendMailTemplateAsync(request.Email, "Password","Templates/StudentRegisterMail.cshtml", mailTemplateModel);
        
        var response = mapper.Map<UserResDto>(dbUser.Entity);
        
        return Result<UserResDto>.Success(response);
    }

    public async Task<Result<UserResDto>> RegisterCompanyRepresentativeAsync(CompanyRepresentativeRegisterReqDto request)
    {
        // Check if user already exists, if so return failure
        if (await context.Users.AnyAsync(u => u.Email == request.Email))
        {
            return Result<UserResDto>.Failure(Error.UserAlreadyExists);
        }

        // Generate random password and hash it with bCrypt
        var password = AuthStatics.GenerateRandomPassword();
        var passwordHash = BCrypt.Net.BCrypt.EnhancedHashPassword(password);

        var user = mapper.Map<User>(request);
        user.PasswordHash = passwordHash;
        user.Role = ERole.CompanyRepresentative;
        user.IsPasswordDirty = true;
        
        var dbUser = await context.Users.AddAsync(user);
        await context.SaveChangesAsync();
        
        // TODO replace with proper password sending via mail
        Console.WriteLine(password);

        var response = mapper.Map<UserResDto>(dbUser.Entity);
        
        return Result<UserResDto>.Success(response);
    }

    public async Task<Result<UserResDto>> GetUserByIdAsync(Guid userId)
    {
        var user = await context.Users.FirstOrDefaultAsync(u => u.Id == userId);

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

        var redirector = "/";

        if (user.IsPasswordDirty)
        {
            redirector = "/changeDefaultPassword";
        }
        
        var tokens = await CreateTokenResponse(user, redirector);
        
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

    public async Task<Result<TokenResDto>> ChangeDefaultPassword(ChangeDefaultPasswordReqDto request)
    {
        var user = await context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

        if (user is null)
        {
            return Result<TokenResDto>.Failure(Error.NotFound);
        }

        if (!user.IsPasswordDirty)
        {
            return Result<TokenResDto>.Failure(Error.BadRequest);
        }
        
        var passwordHash = BCrypt.Net.BCrypt.EnhancedHashPassword(request.Password);

        user.PasswordHash = passwordHash;
        user.IsPasswordDirty = false;

        await context.SaveChangesAsync();
        
        var tokens = await CreateTokenResponse(user, "/");
        
        return Result<TokenResDto>.Success(tokens);
    }

    public async Task<Result> ChangePasswordAsync(Guid userId, ChangePasswordReqDto request)
    {
        var user = await context.Users.FirstOrDefaultAsync(u => u.Id == userId);

        if (user is null)
        {
            return Result.Failure(Error.NotFound);
        }

        var isCurrentValid = BCrypt.Net.BCrypt.EnhancedVerify(request.CurrentPassword, user.PasswordHash);

        if (!isCurrentValid)
        {
            return Result.Failure(Error.InvalidCredentials);
        }

        if (request.NewPassword == request.CurrentPassword)
        {
            return Result.Failure(Error.BadRequest);
        }

        user.PasswordHash = BCrypt.Net.BCrypt.EnhancedHashPassword(request.NewPassword);
        user.IsPasswordDirty = false;

        await context.SaveChangesAsync();

        return Result.Success();
    }

    public async Task<Result> LogoutAsync(string accessToken)
    {
        var principal = AuthStatics.GetPrincipalFromExpiredToken(authConfiguration.Value.Issuer, authConfiguration.Value.Audience, authConfiguration.Value.SigningKey, accessToken);
        
        if (principal is null)
        {
            return Result.Failure(Error.InvalidAuthToken);
        }
    
        var userId = principal.FindFirstValue(ClaimTypes.NameIdentifier);
        var tokenId = principal.FindFirstValue(JwtRegisteredClaimNames.Jti);
        
        if (userId is null || tokenId is null)
        {
            return Result.Failure(Error.InvalidAuthToken);
        }
        
        var refreshToken = await context.RefreshTokens
            .Where(rt => rt.UserId == new Guid(userId) && rt.JwtId == new Guid(tokenId))
            .FirstOrDefaultAsync();

        if (refreshToken is null)
        {
            return Result.Failure(Error.InvalidAuthToken);
        }
        
        context.RefreshTokens.Remove(refreshToken);
        await context.SaveChangesAsync();
        
        return Result.Success();
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
            new(JwtRegisteredClaimNames.Jti, tokenId),
            new("IsPasswordDirty", user.IsPasswordDirty.ToString())
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

    public async Task<Result> ForgotPasswordAsync(ForgotPasswordReqDto request)
    {
        // Always return success to prevent email enumeration
        // Do all operations but don't reveal if email exists
        
        var user = await context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        
        if (user is null)
        {
            // Log attempt but don't reveal to caller
            logger.LogInformation("Password reset requested for non-existent email");
            return Result.Success();
        }
        
        // Check cooldown - prevent spam
        // Check ANY recent token (including revoked) to prevent rapid requests
        var cooldownMinutes = _authConfig.PasswordReset.CooldownMinutes;
        var mostRecentToken = await context.PasswordResetTokens
            .Where(t => t.UserId == user.Id)
            .OrderByDescending(t => t.CreatedAt)
            .FirstOrDefaultAsync();
        
        if (mostRecentToken is not null && mostRecentToken.CreatedAt.AddMinutes(cooldownMinutes) > DateTime.UtcNow)
        {
            // Cooldown active - don't send new email, but still return success
            logger.LogInformation("Password reset cooldown active for user {UserId}", user.Id);
            return Result.Success();
        }
        
        // Revoke all existing unused tokens for this user
        var existingTokens = await context.PasswordResetTokens
            .Where(t => t.UserId == user.Id && !t.IsRevoked && t.UsedAt == null)
            .ToListAsync();
        
        foreach (var token in existingTokens)
        {
            token.IsRevoked = true;
        }
        
        // Generate new token
        var plainToken = AuthStatics.GenerateUrlSafeToken(32);
        var tokenHash = AuthStatics.ComputeSha256Hash(plainToken);
        var expirationMinutes = _authConfig.PasswordReset.TokenExpirationMinutes;
        
        var resetToken = new PasswordResetToken
        {
            TokenHash = tokenHash,
            ExpiresAt = DateTime.UtcNow.AddMinutes(expirationMinutes),
            UserId = user.Id
        };
        
        await context.PasswordResetTokens.AddAsync(resetToken);
        await context.SaveChangesAsync();
        
        // Build reset URL
        var frontendUrl = configuration.GetValue<string>("Consumers:FrontendURL") ?? "http://localhost:5173";
        var resetUrl = $"{frontendUrl}/reset-password?token={plainToken}";
        
        // Send email
        var mailModel = new PasswordResetLinkMail
        {
            FirstName = user.FirstName,
            LastName = user.LastName,
            ResetUrl = resetUrl,
            ExpirationMinutes = expirationMinutes
        };
        
        try
        {
            await mailService.SendMailTemplateAsync(
                user.Email, 
                "Reset hesla - InternshipManager",
                "Templates/PasswordResetLinkMail.cshtml", 
                mailModel);
            
            logger.LogInformation("Password reset email sent to user {UserId}", user.Id);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to send password reset email to user {UserId}", user.Id);
            // Don't fail the request - token is already created
        }
        
        return Result.Success();
    }

    public async Task<Result> ResetPasswordAsync(ResetPasswordReqDto request)
    {
        // Hash the provided token to find it in database
        var tokenHash = AuthStatics.ComputeSha256Hash(request.Token);
        
        var resetToken = await context.PasswordResetTokens
            .Include(t => t.User)
            .FirstOrDefaultAsync(t => t.TokenHash == tokenHash);
        
        // Validate token exists
        if (resetToken is null)
        {
            logger.LogWarning("Password reset attempted with invalid token");
            return Result.Failure(Error.InvalidResetToken);
        }
        
        // Validate token not expired
        if (resetToken.ExpiresAt < DateTime.UtcNow)
        {
            logger.LogWarning("Password reset attempted with expired token for user {UserId}", resetToken.UserId);
            return Result.Failure(Error.InvalidResetToken);
        }
        
        // Validate token not revoked
        if (resetToken.IsRevoked)
        {
            logger.LogWarning("Password reset attempted with revoked token for user {UserId}", resetToken.UserId);
            return Result.Failure(Error.InvalidResetToken);
        }
        
        // Validate token not already used
        if (resetToken.UsedAt is not null)
        {
            logger.LogWarning("Password reset attempted with already used token for user {UserId}", resetToken.UserId);
            return Result.Failure(Error.ResetTokenAlreadyUsed);
        }
        
        // Update user's password
        var user = resetToken.User;
        user.PasswordHash = BCrypt.Net.BCrypt.EnhancedHashPassword(request.NewPassword);
        user.IsPasswordDirty = false;
        
        // Mark token as used
        resetToken.UsedAt = DateTime.UtcNow;
        
        // Invalidate all other tokens for this user
        var otherTokens = await context.PasswordResetTokens
            .Where(t => t.UserId == user.Id && t.Id != resetToken.Id && !t.IsRevoked && t.UsedAt == null)
            .ToListAsync();
        
        foreach (var token in otherTokens)
        {
            token.IsRevoked = true;
        }
        
        // Optionally: Revoke all refresh tokens to force re-login everywhere
        var refreshTokens = await context.RefreshTokens
            .Where(t => t.UserId == user.Id && t.RevokedAt == null)
            .ToListAsync();
        
        foreach (var refreshToken in refreshTokens)
        {
            refreshToken.RevokedAt = DateTime.UtcNow;
        }
        
        await context.SaveChangesAsync();
        
        logger.LogInformation("Password successfully reset for user {UserId}", user.Id);
        
        return Result.Success();
    }

    [Obsolete("Use ForgotPasswordAsync and ResetPasswordAsync instead")]
    public async Task<Result> ResetUserPasswordAsync(UserResetPasswordReqDto request)
    {
        var user = await context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

        if (user is null)
        {
            return Result.Failure(Error.NotFound);
        }
        
        var password = AuthStatics.GenerateRandomPassword();

        var hashedPassword = BCrypt.Net.BCrypt.EnhancedHashPassword(password);

        user.PasswordHash = hashedPassword;
        
        user.IsPasswordDirty = true;
        
        await context.SaveChangesAsync();

        var mailTemplateModel = new UserResetPasswordMail
        {
            FirstName = user.FirstName,
            LastName = user.LastName,
            GeneratedPassword = password
        };
        
        await mailService.SendMailTemplateAsync(user.Email, "Password Reset","Templates/UserResetPasswordMail.cshtml", mailTemplateModel);
        
        return Result.Success();
    }
}