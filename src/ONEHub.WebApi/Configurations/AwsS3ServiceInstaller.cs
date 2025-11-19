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
        var s3Setting = configuration.GetSection(AwsS3Setting.SETTING_NAME).Get<AwsS3Setting>();
        var proxySetting = configuration.GetSection(ProxySetting.SETTING_NAME).Get<ProxySetting>();

        var s3Config = new AmazonS3Config
        {
            RegionEndpoint = RegionEndpoint.GetBySystemName(s3Setting!.Region)
        };

        if (proxySetting!.IsUseProxy)
        {
            s3Config.ProxyHost = proxySetting.ProxyHost;
            s3Config.ProxyPort = proxySetting.ProxyPort;
        }

        services.AddSingleton<IAmazonS3>(_ =>
            new AmazonS3Client(
                s3Setting.AccessKey,
                s3Setting.SecretKey,
                s3Config
            ));
        services.AddSingleton<IStorageService, S3StorageService>();
    }
}
