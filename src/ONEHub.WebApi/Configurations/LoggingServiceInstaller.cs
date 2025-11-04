using Fanex.Logging;
using Fanex.Logging.Sentry;
using ONEHub.Domain.Settings;
using Sentry;
using Serilog;

namespace ONEHub.WebApi.Configurations;

public class LoggingServiceInstaller : IServiceInstaller
{
    public void Install(IServiceCollection services, IConfiguration configuration)
    {
        var sentrySetting = configuration.GetSection(SentrySetting.SettingName).Get<SentrySetting>();

        ArgumentNullException.ThrowIfNull(sentrySetting);

        if (!string.IsNullOrEmpty(sentrySetting.Dsn) && !string.IsNullOrEmpty(sentrySetting.LogCategory))
        {
            LogManager.SetDefaultLogCategory(sentrySetting.LogCategory).Use(new List<ILogEngine>
            {
                new SentryLogging(new SentryEngineOptions
                {
                    Dsn = new Dsn(sentrySetting.Dsn),
                    Environment = sentrySetting.Environment
                })
            });
        }
        else
        {
            LogManager.SetDefaultLogCategory("ONEHub.Admin.Default").Use(new List<ILogEngine>());
        }

        services.AddSerilog((s, l) => l
            .ReadFrom.Configuration(configuration)
            .ReadFrom.Services(s)
            .Enrich.FromLogContext()
            .Enrich.WithMachineName());
    }
}
