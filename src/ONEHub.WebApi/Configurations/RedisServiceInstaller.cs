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
    }
}
