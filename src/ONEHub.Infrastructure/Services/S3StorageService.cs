using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using ONEHub.Application.Services;
using ONEHub.Domain.Settings;

namespace ONEHub.Infrastructure.Services;

public sealed class S3StorageService(IAmazonS3 s3Client, IOptions<AwsS3Settings> settings) : IStorageService
{
    private readonly string _bucketName = settings.Value.BucketName;

    public async Task<bool> UploadFileAsync(IFormFile file, string key)
    {
        await using var stream = file.OpenReadStream();
        var request = new PutObjectRequest
        {
            BucketName = _bucketName,
            Key = key,
            InputStream = stream,
            ContentType = file.ContentType
        };

        var response = await s3Client.PutObjectAsync(request);
        return response.HttpStatusCode == System.Net.HttpStatusCode.OK;
    }

    public async Task<bool> DeleteFileAsync(string key)
    {
        var request = new DeleteObjectRequest
        {
            BucketName = _bucketName,
            Key = key
        };

        var response = await s3Client.DeleteObjectAsync(request);
        return response.HttpStatusCode == System.Net.HttpStatusCode.OK;
    }

    public async Task<bool> CopyFileAsync(string sourceKey, string destinationKey)
    {
        var copyRequest = new CopyObjectRequest
        {
            SourceBucket = _bucketName,
            SourceKey = sourceKey,
            DestinationBucket = _bucketName,
            DestinationKey = destinationKey
        };

        var response = await s3Client.CopyObjectAsync(copyRequest);

        return response.HttpStatusCode == System.Net.HttpStatusCode.OK;
    }

    public async Task<bool> FileExistsAsync(string key)
    {
        try
        {
            var response = await s3Client.GetObjectMetadataAsync(_bucketName, key);
            return response.HttpStatusCode == System.Net.HttpStatusCode.OK;
        }
        catch (AmazonS3Exception ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
        {
            return false;
        }
    }
}
