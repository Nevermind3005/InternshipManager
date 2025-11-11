using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.Extensions.Options;
using server.Foundation.Configuration;
using server.Models;

namespace server.Services;

public class S3Service(IOptions<S3Configuration> s3Config) : IS3Service
{
    private readonly IAmazonS3 _s3Client = new AmazonS3Client(
        s3Config.Value.AccessKey,
        s3Config.Value.SecretKey,
        new AmazonS3Config
        {
            ServiceURL = s3Config.Value.Endpoint,
            ForcePathStyle = true
        }
    );
    private readonly string _bucketName = s3Config.Value.BucketName;

    public async Task UploadFileAsync(Stream fileStream, Guid owner, string key)
    {
        var request = new PutObjectRequest
        {
            BucketName = _bucketName,
            Key = $"{owner.ToString()}/{key}",
            InputStream = fileStream
        };
        await _s3Client.PutObjectAsync(request);
    }

    public async Task<FileResponse> DownloadFileAsync(string key)
    {
        var response = await _s3Client.GetObjectAsync(_bucketName, key);
        var memoryStream = new MemoryStream();
        await response.ResponseStream.CopyToAsync(memoryStream);
        memoryStream.Position = 0;
        var fileResponse = new FileResponse
        {
            FileStream = memoryStream,
            ContentType = response.Headers.ContentType
        };
        return fileResponse;
    }
}