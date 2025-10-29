using System.Collections.ObjectModel;
using Fanex.Data.Vault;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace ONEHub.WebApi.HealthChecks;

public class VaultHealthCheck(IConfiguration configuration, VaultDbAliasService vaultDbAliasService) : IHealthCheck
{
    public Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
    {
        IDictionary<string, object> data = new Dictionary<string, object>();
        var dbAlias = configuration.GetSection("ConnectionStrings")
            .GetChildren()
            .Select(config => config["Name"]?.Split(".").FirstOrDefault())
            .Distinct();

        foreach (var alias in dbAlias)
        {
            if (alias != null)
            {
                data.Add(alias, vaultDbAliasService.GetIp(alias));
            }
        }

        return Task.FromResult(HealthCheckResult.Healthy("Vault Info", new ReadOnlyDictionary<string, object>(data)));
    }
}

