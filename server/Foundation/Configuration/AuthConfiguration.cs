namespace server.Foundation.Configuration;

public class AuthConfiguration
{
    public required string SigningKey { get; set; }
    public required string Issuer { get; set; }
    public required string Audience { get; set; }
    public required AuthLifetime Lifetime { get; set; }
}

public class AuthLifetime
{
    public uint AccessToken { get; set; }
    public uint RefreshToken { get; set; }
}