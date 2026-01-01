namespace server.Models;

public class FileResponse
{
    public Stream FileStream { get; set; } = null!;
    public string ContentType { get; set; } = "";
}