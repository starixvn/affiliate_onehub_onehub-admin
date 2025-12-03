using Microsoft.AspNetCore.HttpOverrides;
using ONEHub.Application;
using ONEHub.Domain.Settings;
using ONEHub.Infrastructure;
using ONEHub.WebApi.Configurations;
using ONEHub.WebApi.HostedServices;

namespace ONEHub.WebApi.Startup;

public static class DependencyInjection
{
    public static IServiceCollection AddDependencyInjection(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<AppSetting>(configuration.GetSection(AppSetting.SettingName));
        services.Configure<SentrySetting>(configuration.GetSection(SentrySetting.SettingName));
        services.Configure<RedisSetting>(configuration.GetSection(RedisSetting.SettingName));
        services.Configure<JwtSetting>(configuration.GetSection(JwtSetting.SettingName));
        services.Configure<AwsS3Setting>(configuration.GetSection(AwsS3Setting.SETTING_NAME));
        services.Configure<ProxySetting>(configuration.GetSection(ProxySetting.SETTING_NAME));
        services.Configure<GSheetsSettings>(configuration.GetSection(GSheetsSettings.SettingName));

        services
            .AddApplication()
            .AddInfrastructure(configuration);

        services.AddHostedService<RabbitMqBusHostedService>();

        services.AddCors(configuration);

        services.Configure<ForwardedHeadersOptions>(options =>
        {
            options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto | ForwardedHeaders.XForwardedHost;
            options.ForwardLimit = null;
            options.KnownNetworks.Clear();
            options.KnownProxies.Clear();
        });

        services.AddExceptionHandler<GlobalExceptionHandler>();

        services.AddHttpContextAccessor();

        services.InstallServicesFromInfrastructure(configuration);
        services.InstallServicesFromAssembly<AuthenticationServiceInstaller>(configuration);

        return services;
    }

    private static void AddCors(this IServiceCollection services, IConfiguration configuration)
    {
        var appSetting = configuration.GetSection(AppSetting.SettingName).Get<AppSetting>();
        ArgumentNullException.ThrowIfNull(appSetting);

        var allowedDomains = appSetting.AllowedDomains;

        services.AddCors(options =>
        {
            options.AddDefaultPolicy(policy =>
            {
                policy
                    .SetIsOriginAllowed(origin =>
                    {
                        if (allowedDomains is null || allowedDomains.Length == 0)
                        {
                            return true;
                        }

                        if (string.IsNullOrEmpty(origin))
                        {
                            return false;
                        }

                        var uri = new Uri(origin);
                        var host = uri.Host;

                        return Array.Exists(allowedDomains, allowedDomain =>
                        {
                            if (allowedDomain.StartsWith("*.", StringComparison.OrdinalIgnoreCase))
                            {
                                var domain = allowedDomain.Substring(2);
                                return host.EndsWith(domain, StringComparison.OrdinalIgnoreCase) ||
                                       host.Equals(domain, StringComparison.OrdinalIgnoreCase);
                            }

                            var domainToMatch = allowedDomain
                                .Replace("https://", "", StringComparison.OrdinalIgnoreCase)
                                .Replace("http://", "", StringComparison.OrdinalIgnoreCase);

                            return host.Equals(domainToMatch, StringComparison.OrdinalIgnoreCase);
                        });
                    })
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials();
            });
        });
    }
}
