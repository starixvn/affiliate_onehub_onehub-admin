using System.Collections.ObjectModel;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;

namespace ONEHub.Infrastructure.HealthChecks;

public class WhoAmIHealthCheck : IHealthCheck
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IHostEnvironment _env;

    public WhoAmIHealthCheck(IHttpContextAccessor httpContextAccessor, IHostEnvironment env)
    {
        _httpContextAccessor = httpContextAccessor;
        _env = env;
    }

    public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
    {
        IDictionary<string, object> result = new Dictionary<string, object>
        {
            { "Env", _env.EnvironmentName }
        };
        await AddServerIPInfo(result);
        AddExtraServerInfo(result);

        return HealthCheckResult.Healthy("ONEHub Admin - Server Info", new ReadOnlyDictionary<string, object>(result));
    }

    private static async Task AddServerIPInfo(IDictionary<string, object> result)
    {
        var hostName = Dns.GetHostName();
        result.Add("Host Name", hostName);

        var serverIps = await Dns.GetHostAddressesAsync(hostName).ConfigureAwait(false);
        for (var i = 0; i < serverIps.Length; i++)
        {
            if (serverIps[i].AddressFamily == AddressFamily.InterNetwork)
            {
                result.Add($"IP{i}", serverIps[i].ToString());
            }
        }
    }

    private void AddExtraServerInfo(IDictionary<string, object> result)
    {
        var context = _httpContextAccessor.HttpContext;

        if (context != null)
        {
            result.Add("Local Ip", context.Connection.LocalIpAddress?.ToString() ?? "N/A");
            result.Add("Local Port", context.Connection.LocalPort);
            result.Add("Client Ip", context.Connection.RemoteIpAddress?.ToString() ?? "N/A");
            result.Add("Server Time", DateTimeOffset.UtcNow.ToString(CultureInfo.InvariantCulture));
            result.Add("Last Updated", File.GetCreationTime(typeof(WhoAmIHealthCheck).Assembly.Location).ToString(CultureInfo.InvariantCulture));
            result.Add("Host", context.Request.Host.ToString());
            result.Add("Schema", context.Request.Scheme);
            result.Add("X-Headers", "---------------------------------");

            foreach (var item in context.Request.Headers.Where(i => i.Key.Contains("X-", StringComparison.OrdinalIgnoreCase)))
            {
                result.Add($" + {item.Key}", JsonConvert.SerializeObject(item.Value));
            }
        }
        else
        {
            result.Add("Server Time", DateTimeOffset.UtcNow.ToString(CultureInfo.InvariantCulture));
        }
    }
}

