using server.Models;

namespace server.Services;

public interface IS3Service
{
    public Task UploadFileAsync(Stream fileStream, Guid owner, string key);
    public Task<FileResponse> DownloadFileAsync(string key);
}