using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Newtonsoft.Json;
using ONEHub.Infrastructure.HealthChecks;
using System.Net.Mime;

namespace ONEHub.WebApi.Extensions;

public static class HealthCheckExtensions
{
    public static IHealthChecksBuilder AddSiteHealthChecks(this IServiceCollection services, IConfiguration configuration)
    {
        var redisSetting = configuration.GetSection("fanex.caching.redis");
        var connectionString = configuration.GetConnectionString("DBConnection");

        var healthCheckBuilder = services.AddHealthChecks()
            .AddCheck<WhoAmIHealthCheck>("WhoAmI");

        if (!string.IsNullOrEmpty(redisSetting["Server"]))
        {
            var redisConnection = $"{redisSetting["Server"]}:{redisSetting["Port"]},password={redisSetting["Pass"]}";
            healthCheckBuilder.AddRedis(redisConnection, "Redis");
        }

        if (!string.IsNullOrEmpty(connectionString))
        {
            healthCheckBuilder.AddSqlServer(connectionString, name: "SqlServer");
        }

        return healthCheckBuilder;
    }

    public static void UseSiteHealthChecks(this IApplicationBuilder app, IConfiguration configuration)
    {
        static async Task CustomResponseWriter(HttpContext context, HealthReport report)
        {
            var result = JsonConvert.SerializeObject(
                new
                {
                    status = report.Status.ToString(),
                    monitors = report.Entries.Select(e => new
                    {
                        name = e.Key,
                        status = Enum.GetName(e.Value.Status),
                        values = e.Value.Data
                    })
                }, Formatting.Indented);

            context.Response.ContentType = MediaTypeNames.Application.Json;
            await context.Response.WriteAsync(result);
        }

        var accessKey = configuration["HealthCheck:AccessKey"];

        app.UseWhen(context =>
            string.IsNullOrEmpty(accessKey) ||
            (context.Request.Query.TryGetValue("AccessKey", out var value) && accessKey.Equals(value, StringComparison.Ordinal)),
            builder => builder
                .UseHealthChecks("/healthz", new HealthCheckOptions
                {
                    AllowCachingResponses = false,
                    Predicate = _ => _.Name.Equals("WhoAmI", StringComparison.Ordinal),
                    ResponseWriter = CustomResponseWriter
                }).UseHealthChecks("/healthcheck", options: new HealthCheckOptions
                {
                    AllowCachingResponses = false,
                    Predicate = _ => !_.Name.Equals("WhoAmI", StringComparison.Ordinal),
                    ResponseWriter = CustomResponseWriter
                }));
    }
}

