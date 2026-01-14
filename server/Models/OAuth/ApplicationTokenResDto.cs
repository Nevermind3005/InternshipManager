namespace server.Models.OAuth;

public class ApplicationTokenResDto
{
    public string AccessToken { get; set; } = string.Empty;
    public string TokenType { get; } = "Bearer";
    public uint ExpiresIn { get; set; }
}