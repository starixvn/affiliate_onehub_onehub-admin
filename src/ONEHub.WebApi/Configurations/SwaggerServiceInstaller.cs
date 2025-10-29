using Microsoft.OpenApi.Models;

namespace ONEHub.WebApi.Configurations;

public class SwaggerServiceInstaller : IServiceInstaller
{
    public void Install(IServiceCollection services, IConfiguration configuration)
    {
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen(options =>
        {
            options.SwaggerDoc("v1", new OpenApiInfo { Version = "v1", Title = "ONEHub Admin Web API", });
        });
    }
}
