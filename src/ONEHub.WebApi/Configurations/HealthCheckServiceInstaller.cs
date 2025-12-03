using ONEHub.Infrastructure.Configurations;
using ONEHub.WebApi.HealthChecks;

namespace ONEHub.WebApi.Configurations;

public class HealthCheckServiceInstaller : IServiceInstaller
{
    public void Install(IServiceCollection services, IConfiguration configuration)
    {
        services
            .AddHealthChecks()
            .AddCheck<VaultHealthCheck>("Vault")
            .AddCheck<ServerHealthCheck>("Server");
    }
}
