using System.Security.Cryptography;
using SimpleBase;

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
}