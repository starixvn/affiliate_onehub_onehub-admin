using Fanex.Data.Repository;
using Fanex.Logging;
using Microsoft.Extensions.DependencyInjection;
using ONEHub.Application.Services;
using ONEHub.Domain.Repositories;
using ONEHub.Infrastructure.Repositories;
using ONEHub.Infrastructure.Services;

namespace ONEHub.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        services.AddSingleton<ILogger, Logger>();

        // Service
        services.AddSingleton<IJwtTokenService, JwtTokenService>();
        services.AddSingleton<IDateTimeProvider, SystemDateTimeProvider>();
        services.AddSingleton<ICacheProvider, DistributedCacheProvider>();
        services.AddScoped<ICurrentUserService, CurrentUserService>();

        // Repository
        services.AddSingleton<IDynamicRepository, DynamicRepository>();
        services.AddSingleton<IAuthRepository, AuthRepository>();
        services.AddSingleton<ICampaignRepository, CampaignRepository>();
        services.AddSingleton<IComponentRepository, ComponentRepository>();

        return services;
    }
}
