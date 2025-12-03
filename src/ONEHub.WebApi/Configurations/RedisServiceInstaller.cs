using ONEHub.Domain.Settings;
using ONEHub.Infrastructure.Configurations;
using StackExchange.Redis;

namespace ONEHub.WebApi.Configurations;

public class RedisServiceInstaller : IServiceInstaller
{
    public void Install(IServiceCollection services, IConfiguration configuration)
    {
        var redisSetting = configuration.GetSection(RedisSetting.SettingName).Get<RedisSetting>();

        ArgumentNullException.ThrowIfNull(redisSetting);
        services.AddStackExchangeRedisCache(options =>
        {
            options.Configuration = redisSetting.ConnectionString;
            options.InstanceName = redisSetting.ApplicationName;
        });

        services.AddSingleton<IConnectionMultiplexer>(_ => ConnectionMultiplexer.Connect(redisSetting.ConnectionString));
    }
}
