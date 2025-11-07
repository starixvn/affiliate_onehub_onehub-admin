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

namespace ONEHub.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddSingleton<ILogger, Logger>();

        services.Configure<ExternalAuthSetting>(configuration.GetSection(ExternalAuthSetting.SettingName));

        services.AddHttpClient<IExternalAuthService, ExternalAuthService>()
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
            });

        services.AddSingleton<IJwtTokenService, JwtTokenService>();
        services.AddSingleton<IDateTimeProvider, SystemDateTimeProvider>();
        services.AddSingleton<ICacheProvider, DistributedCacheProvider>();
        services.AddScoped<ICurrentUserService, CurrentUserService>();

        services.AddSingleton<IDynamicRepository, DynamicRepository>();
        services.AddSingleton<IAuthRepository, AuthRepository>();
        services.AddSingleton<ICampaignRepository, CampaignRepository>();
        services.AddSingleton<IComponentRepository, ComponentRepository>();
        services.AddSingleton<ILandingPageRepository, LandingPageRepository>();
        services.AddSingleton<ISettingsRepository, SettingsRepository>();

        return services;
    }
}
