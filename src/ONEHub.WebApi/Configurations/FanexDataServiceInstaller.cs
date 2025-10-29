using Fanex.Data;
using Fanex.Data.Vault;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace ONEHub.WebApi.Configurations;

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
