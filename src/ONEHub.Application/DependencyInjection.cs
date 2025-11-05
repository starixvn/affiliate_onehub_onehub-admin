using Microsoft.Extensions.DependencyInjection;
using ONEHub.Application.Features.Shared;

namespace ONEHub.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        var assembly = AssemblyReference.Assembly;

        services.AddMediatR(cfg =>
        {
            cfg.RegisterServicesFromAssembly(assembly);
            cfg.AddOpenBehavior(typeof(UserContextBehavior<,>));
        });

        return services;
    }
}

