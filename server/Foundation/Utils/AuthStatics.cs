using System.IdentityModel.Tokens.Jwt;
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
    /// <param name="signingKey">Key used to sign token.</param>
    /// <param name="expiresIn">Token expiration date and time.</param>
    /// <returns>A signed JWT token string.</returns>
    public static string CreateToken(IEnumerable<Claim> claims, string signingKey, DateTime expiresIn)
    {
        // Token needs to be 64 characters long due to the signing HmacSha512 algorithm (512 / 8 = 64)
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(signingKey));

        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

        var tokenDescriptor = new JwtSecurityToken(
            claims: claims,
            expires: expiresIn,
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);
    }
}