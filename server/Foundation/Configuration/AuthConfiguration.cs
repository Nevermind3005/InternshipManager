namespace server.Foundation.Configuration;

public class AuthConfiguration
{
    public required string SigningKey { get; set; }
    public required string Issuer { get; set; }
    public required string Audience { get; set; }
    public required AuthLifetime Lifetime { get; set; }
    public PasswordResetConfiguration PasswordReset { get; set; } = new();
}

public class AuthLifetime
{
    public uint AccessToken { get; set; }
    public uint RefreshToken { get; set; }
}

public class PasswordResetConfiguration
{
    /// <summary>
    /// Token expiration time in minutes. Default: 30 minutes.
    /// </summary>
    public int TokenExpirationMinutes { get; set; } = 30;
    
    /// <summary>
    /// Minimum time in minutes before a new token can be requested. Default: 2 minutes.
    /// </summary>
    public int CooldownMinutes { get; set; } = 2;
}