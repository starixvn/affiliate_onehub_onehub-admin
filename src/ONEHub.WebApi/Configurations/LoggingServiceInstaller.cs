using Fanex.Logging;
using Fanex.Logging.Sentry;
using Sentry;
using Serilog;

namespace ONEHub.WebApi.Configurations;

public class LoggingServiceInstaller : IServiceInstaller
{
    public void Install(IServiceCollection services, IConfiguration configuration)
    {
        var env = configuration["Sentry:Environment"];
        var backEndDsn = configuration["Sentry:Dsn"];
        var category = configuration["Sentry:LogCategory"];

        if (!string.IsNullOrEmpty(backEndDsn) && !string.IsNullOrEmpty(category))
        {
            LogManager.SetDefaultLogCategory(category).Use(new List<ILogEngine>
            {
                new SentryLogging(new SentryEngineOptions
                {
                    Dsn = new Dsn(backEndDsn),
                    Environment = env
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
