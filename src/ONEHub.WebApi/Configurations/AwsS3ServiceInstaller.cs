using Amazon;
using Amazon.Runtime;
using Amazon.S3;
using Amazon.SecurityToken;
using ONEHub.Application.Services;
using ONEHub.Domain.Settings;
using ONEHub.Infrastructure.Services;
using System.Net;

namespace ONEHub.WebApi.Configurations;

public class AwsS3ServiceInstaller : IServiceInstaller
{
    public void Install(IServiceCollection services, IConfiguration configuration)
    {
        var s3Setting = configuration.GetSection(AwsS3Setting.SETTING_NAME).Get<AwsS3Setting>();
        var proxySetting = configuration.GetSection(ProxySetting.SETTING_NAME).Get<ProxySetting>();

        services.AddSingleton<IAmazonS3>(provider =>
        {
            var s3Config = CreateS3Config(s3Setting!, proxySetting!);
            var credentials = CreateAwsCredentials(s3Setting, proxySetting);
            
            // Pre-warm credentials: Force AssumeRole to happen NOW during startup
            // instead of lazy-loading on first request (which causes 20+ second delay)
            _ = credentials.GetCredentials();
            
            return new AmazonS3Client(credentials, s3Config);
        });

        services.AddSingleton<IStorageService, S3StorageService>();
    }

    private static AmazonS3Config CreateS3Config(AwsS3Setting s3Setting, ProxySetting proxySetting)
    {
        var config = new AmazonS3Config
        {
            RegionEndpoint = RegionEndpoint.GetBySystemName(s3Setting.Region)
        };

        ConfigureProxy(config, proxySetting);
        
        return config;
    }

    private static AWSCredentials CreateAwsCredentials(AwsS3Setting s3Setting, ProxySetting proxySetting)
    {
        var credentials = GetBaseCredentials(s3Setting);

        if (!string.IsNullOrWhiteSpace(s3Setting.RoleArn))
        {
            credentials = AssumeRole(credentials, s3Setting, proxySetting);
        }

        return credentials;
    }

    private static AWSCredentials GetBaseCredentials(AwsS3Setting s3Setting)
    {
        if (!string.IsNullOrWhiteSpace(s3Setting.AccessKey) && !string.IsNullOrWhiteSpace(s3Setting.SecretKey))
        {
            return new BasicAWSCredentials(s3Setting.AccessKey, s3Setting.SecretKey);
        }

#pragma warning disable CS0618 // Type or member is obsolete
        return FallbackCredentialsFactory.GetCredentials();
#pragma warning restore CS0618 // Type or member is obsolete
    }

    private static AWSCredentials AssumeRole(AWSCredentials baseCredentials, AwsS3Setting s3Setting, ProxySetting proxySetting)
    {
        var stsConfig = new AmazonSecurityTokenServiceConfig
        {
            RegionEndpoint = RegionEndpoint.GetBySystemName(s3Setting.Region)
        };

        ConfigureProxy(stsConfig, proxySetting);

        var assumeRoleOptions = new AssumeRoleAWSCredentialsOptions
        {
            DurationSeconds = s3Setting.RoleSessionDurationSeconds,
            ProxySettings = proxySetting.IsUseProxy 
                ? new WebProxy(proxySetting.ProxyHost, proxySetting.ProxyPort)
                : null
        };

        // AWS SDK automatically refreshes credentials ~5 minutes before expiration
        return new AssumeRoleAWSCredentials(
            baseCredentials, 
            s3Setting.RoleArn, 
            "ONEHubAdminSession",
            assumeRoleOptions);
    }

    private static void ConfigureProxy(ClientConfig config, ProxySetting proxySetting)
    {
        if (proxySetting.IsUseProxy)
        {
            config.ProxyHost = proxySetting.ProxyHost;
            config.ProxyPort = proxySetting.ProxyPort;
        }
    }
}
