using System.IdentityModel.Tokens.Jwt;
using System.Security;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using SimpleBase;
using Microsoft.IdentityModel.Tokens;

namespace server.Foundation.Utils;

/// <summary>
/// A static utility class for handling authentication related tasks
/// </summary>
public static class AuthStatics
{
    public const string PolicyNoDirtyPassword = "NO_DIRTY_PASSWORD";
    
    /// <summary>
    /// Generates a short random password encoded using Base32 (RFC 4648 format).
    /// </summary>
    /// <returns>An 8-byte random password encoded as a Base32 string.</returns>
    public static string GenerateRandomPassword()
    {
        var randomBytes = RandomNumberGenerator.GetBytes(8);
        return Base32.Rfc4648.Encode(randomBytes);
    }

    /// <summary>
    /// Creates a signed JWT token using the provided information.
    /// </summary>
    /// <param name="claims">List of claims.</param>
    /// <param name="issuer">Issuer of the token.</param>
    /// <param name="audience">Intended audience of the token.</param>
    /// <param name="signingKey">Key used to sign token.</param>
    /// <param name="expiresIn">Token expiration date and time.</param>
    /// <returns>A signed JWT token string.</returns>
    public static string CreateToken(IEnumerable<Claim> claims, string issuer, string audience, string signingKey, DateTime expiresIn)
    {
        // Token needs to be 64 characters long due to the signing HmacSha512 algorithm (512 / 8 = 64)
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(signingKey));

        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

        var tokenDescriptor = new JwtSecurityToken(
            claims: claims,
            issuer: issuer,
            audience: audience,
            expires: expiresIn,
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);
    }
    
    /// <summary>
    /// Extracts a <see cref="ClaimsPrincipal"/> from an expired JWT token.
    /// This is  used during token refresh, where the expired token's claims are needed.
    /// </summary>
    /// <param name="issuer">The expected issuer of the token.</param>
    /// <param name="audience">The expected audience of the token.</param>
    /// <param name="signingKey">The signing key used to validate the token's signature.</param>
    /// <param name="token">The JWT token string.</param>
    /// <returns>A <see cref="ClaimsPrincipal"/> extracted from the token if validation succeeds.</returns>
    /// <exception cref="SecurityException">Thrown if the token is invalid or uses an unexpected algorithm.</exception>
    public static ClaimsPrincipal? GetPrincipalFromExpiredToken(string issuer, string audience, string signingKey, string token)
    {
        var tokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = issuer,
            ValidateAudience = true,
            ValidAudience = audience,
            ValidateLifetime = false, // Needs to be false, as we are getting data from an expired token
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(signingKey))
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out var securityToken);
        var jwtSecurityToken = securityToken as JwtSecurityToken;
        if (jwtSecurityToken is null || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha512, StringComparison.InvariantCultureIgnoreCase))
        {
            return null;
        }

        return principal;
    }
    
    /// <summary>
    /// Generates a secure random refresh token, encoded in Base64.
    /// </summary>
    /// <returns>A cryptographically secure 32-byte random token as a Base64 string.</returns>
    public static string GenerateRefreshToken()
    {
        return GenerateRandomBase64(32);
    }
    
    /// <summary>
    /// Generates a cryptographically secure random string encoded in Base64.
    /// </summary>
    /// <param name="byteLength">The number of random bytes to generate (default is 32).</param>
    /// <returns>A Base64-encoded random string.</returns>
    public static string GenerateRandomBase64(int byteLength = 32)
    {
        var randomBytes = RandomNumberGenerator.GetBytes(byteLength);
        return Convert.ToBase64String(randomBytes);
    }
}