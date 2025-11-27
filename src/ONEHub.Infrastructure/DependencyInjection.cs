using System.Net;
using Fanex.Data.Repository;
using Fanex.Logging;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using ONEHub.Application.Services;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Settings;
using ONEHub.Infrastructure.Repositories;
using ONEHub.Infrastructure.Services;
using Polly;
using Polly.Extensions.Http;

namespace ONEHub.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddSingleton<ILogger, Logger>();

        services.Configure<ExternalAuthSetting>(configuration.GetSection(ExternalAuthSetting.SettingName));

        services.AddHttpClient<IExternalAuthService, ExternalAuthService>((sp, client) =>
            {
                var settings = sp.GetRequiredService<IOptions<ExternalAuthSetting>>().Value;
                ArgumentNullException.ThrowIfNull(settings);
                client.BaseAddress = new Uri(settings.Host);
                client.Timeout = TimeSpan.FromSeconds(settings.TimeoutSeconds);
            })
            .ConfigurePrimaryHttpMessageHandler(sp =>
            {
                var settings = sp.GetRequiredService<IOptions<ExternalAuthSetting>>().Value;
                var handler = new HttpClientHandler();
                if (!string.IsNullOrEmpty(settings.ProxyUrl))
                {
                    handler.Proxy = new WebProxy(settings.ProxyUrl);
                    handler.UseProxy = true;
                }
                return handler;
            })
            .AddPolicyHandler((serviceProvider, _) =>
            {
                var logger = serviceProvider.GetRequiredService<ILogger>();
                return HttpPolicyExtensions
                    .HandleTransientHttpError()
                    .OrResult(msg => msg.StatusCode is HttpStatusCode.InternalServerError
                                   or HttpStatusCode.BadGateway
                                   or HttpStatusCode.ServiceUnavailable)
                    .WaitAndRetryAsync(
                        retryCount: 3,
                        sleepDurationProvider: retryAttempt => TimeSpan.FromSeconds(Math.Pow(2, retryAttempt))
                                                                + TimeSpan.FromMilliseconds(Random.Shared.Next(0, 1000)),
                        onRetry: (outcome, timespan, retryCount, _) =>
                        {
                            var reason = outcome.Exception?.Message ?? outcome.Result?.StatusCode.ToString() ?? "Unknown";
                            logger.Info($"ExternalAuth Polly Retry {retryCount} after {timespan.TotalSeconds:F1}s due to {reason}");
                        });
            });

        services.AddSingleton<IJwtTokenService, JwtTokenService>();
        services.AddSingleton<IDateTimeProvider, SystemDateTimeProvider>();
        services.AddSingleton<ICacheProvider, DistributedCacheProvider>();
        services.AddScoped<ICurrentUserService, CurrentUserService>();
        services.AddSingleton<ILandingPageService, LandingPageService>();
        services.AddSingleton<IFileService, S3FileService>();
        services.AddSingleton<IImageService, ImageService>();

        services.AddSingleton<IDynamicRepository, DynamicRepository>();
        services.AddSingleton<ISystemRepository, SystemRepository>();
        services.AddSingleton<IAuthRepository, AuthRepository>();
        services.AddSingleton<ICampaignRepository, CampaignRepository>();
        services.AddSingleton<IComponentRepository, ComponentRepository>();
        services.AddSingleton<IDomainRepository, DomainRepository>();
        services.AddSingleton<ILandingPageRepository, LandingPageRepository>();
        services.AddSingleton<ILinkGeneratorRepository, LinkGeneratorRepository>();
        services.AddSingleton<IAssetUploaderRepository, AssetUploaderRepository>();
        services.AddSingleton<IPageBuilderRepository, PageBuilderRepository>();
        services.AddSingleton<IPageManagementRepository, PageManagementRepository>();
        services.AddSingleton<ILinkRepository, LinkRepository>();

        return services;
    }
}
