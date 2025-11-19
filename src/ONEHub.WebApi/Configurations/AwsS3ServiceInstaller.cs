using Amazon;
using Amazon.S3;
using ONEHub.Application.Services;
using ONEHub.Domain.Settings;
using ONEHub.Infrastructure.Services;

namespace ONEHub.WebApi.Configurations;

public class AwsS3ServiceInstaller : IServiceInstaller
{
    public void Install(IServiceCollection services, IConfiguration configuration)
    {
        var s3Settings = configuration.GetSection("AwsS3").Get<AwsS3Settings>();

        var s3Config = new AmazonS3Config
        {
            RegionEndpoint = RegionEndpoint.GetBySystemName(s3Settings!.Region)
        };

        if (s3Settings.IsUseProxy)
        {
            s3Config.ProxyHost = s3Settings.ProxyHost;
            s3Config.ProxyPort = s3Settings.ProxyPort;
        }

        services.AddSingleton<IAmazonS3>(_ =>
            new AmazonS3Client(
                s3Settings.AccessKey,
                s3Settings.SecretKey,
                s3Config
            ));
        services.AddSingleton<IStorageService, S3StorageService>();
    }
}
