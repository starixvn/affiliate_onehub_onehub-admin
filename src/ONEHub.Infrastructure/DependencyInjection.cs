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
        services.Configure<InternalTriggerJobSetting>(configuration.GetSection(InternalTriggerJobSetting.SETTING_NAME));

        AddExternalAuthHttpClient(services);
        AddTriggerJobHttpClient(services);

        AddApplicationServices(services);
        AddRepositories(services);

        return services;
    }

    private static void AddExternalAuthHttpClient(IServiceCollection services)
    {
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
                return ConfigureProxyHandler(settings.ProxyUrl);
            })
            .AddPolicyHandler((serviceProvider, _) => CreateRetryPolicy(
                serviceProvider.GetRequiredService<ILogger>(),
                retryCount: 3,
                serviceName: "ExternalAuth"));
    }

    private static void AddTriggerJobHttpClient(IServiceCollection services)
    {
        services.AddHttpClient<ITriggerJobService, TriggerJobService>((sp, client) =>
            {
                var settings = sp.GetRequiredService<IOptions<InternalTriggerJobSetting>>().Value;
                ArgumentNullException.ThrowIfNull(settings);
                client.BaseAddress = new Uri(settings.Host);
                client.Timeout = TimeSpan.FromSeconds(settings.TimeoutSeconds);
            })
            .ConfigurePrimaryHttpMessageHandler(sp =>
            {
                var settings = sp.GetRequiredService<IOptions<InternalTriggerJobSetting>>().Value;
                return ConfigureProxyHandler(settings.ProxyUrl);
            })
            .AddPolicyHandler((serviceProvider, _) => CreateRetryPolicy(
                serviceProvider.GetRequiredService<ILogger>(),
                retryCount: 2,
                serviceName: "TriggerJob"));
    }

    private static HttpClientHandler ConfigureProxyHandler(string? proxyUrl)
    {
        var handler = new HttpClientHandler();
        if (!string.IsNullOrEmpty(proxyUrl))
        {
            handler.Proxy = new WebProxy(proxyUrl);
            handler.UseProxy = true;
        }
        return handler;
    }

    private static IAsyncPolicy<HttpResponseMessage> CreateRetryPolicy(
        ILogger logger,
        int retryCount,
        string serviceName)
    {
        return HttpPolicyExtensions
            .HandleTransientHttpError()
            .OrResult(msg => msg.StatusCode is HttpStatusCode.InternalServerError
                           or HttpStatusCode.BadGateway
                           or HttpStatusCode.ServiceUnavailable)
            .WaitAndRetryAsync(
                retryCount: retryCount,
                sleepDurationProvider: retryAttempt => TimeSpan.FromSeconds(Math.Pow(2, retryAttempt))
                                                        + TimeSpan.FromMilliseconds(Random.Shared.Next(0, 1000)),
                onRetry: (outcome, timespan, retryCount, _) =>
                {
                    var reason = outcome.Exception?.Message ?? outcome.Result?.StatusCode.ToString() ?? "Unknown";
                    logger.Info($"{serviceName} Polly Retry {retryCount} after {timespan.TotalSeconds:F1}s due to {reason}");
                });
    }

    private static void AddApplicationServices(IServiceCollection services)
    {
        services.AddSingleton<ILogProvider, LogProvider>();
        services.AddSingleton<IJwtTokenService, JwtTokenService>();
        services.AddSingleton<IDateTimeProvider, SystemDateTimeProvider>();
        services.AddSingleton<ICacheProvider, DistributedCacheProvider>();
        services.AddScoped<ICurrentUserService, CurrentUserService>();
        services.AddSingleton<ILandingPageService, LandingPageService>();
        services.AddSingleton<IFileService, S3FileService>();
        services.AddSingleton<IImageService, ImageService>();
    }

    private static void AddRepositories(IServiceCollection services)
    {
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
    }
}
