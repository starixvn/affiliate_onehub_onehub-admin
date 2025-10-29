using Fanex.Logging;
using Microsoft.Extensions.DependencyInjection;
using ONEHub.Domain.Interfaces;
using ONEHub.Infrastructure.Authentication;
using ONEHub.Infrastructure.Caching;
using ONEHub.Infrastructure.Data;
using ONEHub.Infrastructure.Logging;
using ONEHub.Infrastructure.Services;

namespace ONEHub.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        services.AddSingleton<ILogger, Logger>();
        services.AddSingleton<ILogProvider, LogProvider>();
        services.AddSingleton<IDynamicRepository, DynamicRepository>();
        services.AddSingleton<ICacheService, RedisCacheService>();

        services.AddScoped<ISessionService, SessionService>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IJwtTokenService, JwtTokenService>();
        services.AddScoped<ILandingPageService, LandingPageService>();
        services.AddScoped<IFileService, FileService>();
        services.AddScoped<ISystemFile, SystemFileService>();
        services.AddScoped<IImageService, ImageService>();

        return services;
    }
}

