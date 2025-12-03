using Fanex.Data;
using Fanex.Data.Vault;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace ONEHub.Infrastructure.Configurations;

public class FanexDataServiceInstaller : IServiceInstaller
{
    public void Install(IServiceCollection services, IConfiguration configuration)
    {
        DbSettingProviderManager
            .StartNewSession()
            .Register(configuration)
            .Run();

        services.TryAddSingleton<VaultDbAliasService, VaultDbAliasServiceImp>();
    }
}

