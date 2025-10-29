using StackExchange.Redis;

namespace ONEHub.WebApi.Configurations;

public class RedisServiceInstaller : IServiceInstaller
{
    public void Install(IServiceCollection services, IConfiguration configuration)
    {
        services.AddStackExchangeRedisCache(options =>
        {
            var redisConfig = configuration.GetSection("Redis");
            options.Configuration = redisConfig.GetValue<string>("ConnectionString");
            options.InstanceName = redisConfig.GetValue<string>("ApplicationName") + ":Session:";
        });

        services.AddSingleton<IConnectionMultiplexer>(sp =>
        {
            var redisConfig = configuration.GetSection("Redis");
            var connectionString = redisConfig.GetValue<string>("ConnectionString")
                ?? throw new InvalidOperationException("Redis ConnectionString not configured");
            return ConnectionMultiplexer.Connect(connectionString);
        });
    }
}
