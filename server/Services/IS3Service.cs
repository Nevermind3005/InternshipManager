using server.Foundation.Result;
using server.Models;

namespace server.Services;

public interface IS3Service
{
    public Task<Result<FileUploadResDto>> UploadFileAsync(Stream fileStream, Guid owner, string key);
    public Task<FileResponse> DownloadFileAsync(string key);
}