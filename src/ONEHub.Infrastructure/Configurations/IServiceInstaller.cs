using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ONEHub.Infrastructure.Configurations;

public interface IServiceInstaller
{
    void Install(IServiceCollection services, IConfiguration configuration);
}

