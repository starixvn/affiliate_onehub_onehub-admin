using Amazon;
using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Infrastructure.Services;

public sealed class S3StorageService : IStorageService, IDisposable
{
    private readonly string _bucketName;
    private readonly AmazonS3Client _s3Client;
    private bool _disposed;

    public S3StorageService(IConfiguration config)
    {
        var accessKey = config["AWS:AccessKey"];
        var secretKey = config["AWS:SecretKey"];
        var region = config["AWS:Region"];
        _bucketName = config["AWS:BucketName"]!;

        _s3Client = new AmazonS3Client(accessKey, secretKey, RegionEndpoint.GetBySystemName(region));
    }

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

        var response = await _s3Client.PutObjectAsync(request);
        return response.HttpStatusCode == System.Net.HttpStatusCode.OK;
    }

    public async Task<bool> DeleteFileAsync(string key)
    {
        var request = new DeleteObjectRequest
        {
            BucketName = _bucketName,
            Key = key
        };

        var response = await _s3Client.DeleteObjectAsync(request);
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

        var response = await _s3Client.CopyObjectAsync(copyRequest);

        return response.HttpStatusCode == System.Net.HttpStatusCode.OK;
    }

    public async Task<bool> FileExistsAsync(string key)
    {
        try
        {
            var response = await _s3Client.GetObjectMetadataAsync(_bucketName, key);
            return response.HttpStatusCode == System.Net.HttpStatusCode.OK;
        }
        catch (AmazonS3Exception ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
        {
            return false;
        }
    }

    public void Dispose() => Dispose(true);

    private void Dispose(bool disposing)
    {
        if (!_disposed)
        {
            if (disposing)
            {
                _s3Client.Dispose();
            }
            _disposed = true;
        }
    }
}
