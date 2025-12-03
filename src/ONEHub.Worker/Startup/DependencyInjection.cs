using EasyNetQ;
using Fanex.Data.Repository;
using Fanex.Logging;
using Microsoft.AspNetCore.HttpOverrides;
using ONEbook.UM.DependencyInjection;
using ONEbook.UM.Services;
using ONEHub.Application.Services;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Settings;
using ONEHub.Infrastructure;
using ONEHub.Infrastructure.Repositories;
using ONEHub.Infrastructure.Services;
using ONEHub.Worker.Consumers;
using ONEHub.Worker.Jobs;
using ILogger = Fanex.Logging.ILogger;
using RabbitBus = ONEHub.Infrastructure.Services.Rabbit.RabbitBus;

namespace ONEHub.Worker.Startup;

public static class DependencyInjection
{
    public static IServiceCollection AddDependencyInjection(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<GSheetsSettings>(configuration.GetSection(GSheetsSettings.SettingName));
        services.Configure<SentrySetting>(configuration.GetSection(SentrySetting.SettingName));
        services.Configure<JobSettings>(configuration.GetSection(JobSettings.SettingName));
        services.Configure<ProxySetting>(configuration.GetSection(ProxySetting.SETTING_NAME));

        var rabbitMqConnectionString = configuration["RabbitMQConnectionString"];
        if (!string.IsNullOrEmpty(rabbitMqConnectionString))
        {
            services.AddSingleton(RabbitHutch.CreateBus(rabbitMqConnectionString));
        }

        services.AddOneBookUmForService(configuration);

        services.AddHostedService<RabbitMqBusHostedService>();
        services.AddHostedService<GSheetsJob>();
        services.AddHostedService<GSheetsConsumer>();

        services.AddSingleton<IMaintenanceService, MaintenanceService>();
        services.AddSingleton<ILogger, Logger>();
        services.AddSingleton<ILogProvider, LogProvider>();
        services.AddSingleton<IRabbitBus, RabbitBus>();
        services.AddSingleton<IDynamicRepository, DynamicRepository>();
        services.AddSingleton<IGSheetsDomainRepository, GSheetsDomainRepository>();

        services.Configure<ForwardedHeadersOptions>(options =>
        {
            options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto | ForwardedHeaders.XForwardedHost;
            options.ForwardLimit = null;
            options.KnownNetworks.Clear();
            options.KnownProxies.Clear();
        });

        services.AddExceptionHandler<GlobalExceptionHandler>();

        services.AddHttpContextAccessor();

        services.AddControllers();

        services.InstallServicesFromInfrastructure(configuration);

        return services;
    }
}
