using Microsoft.AspNetCore.Authorization;
using Microsoft.OpenApi.Models;
using ONEHub.Infrastructure.Configurations;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace ONEHub.WebApi.Configurations;

public class SwaggerServiceInstaller : IServiceInstaller
{
    public void Install(IServiceCollection services, IConfiguration configuration)
    {
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen(options =>
        {
            options.SwaggerDoc("v1", new OpenApiInfo { Version = "v1", Title = "ONEHub Admin Web API", });

            options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                Name = "Authorization",
                Type = SecuritySchemeType.Http,
                Scheme = "Bearer",
                BearerFormat = "JWT",
                In = ParameterLocation.Header,
                Description = "Enter your JWT token in the format: Bearer {your token}"
            });

            options.OperationFilter<AuthorizeOperationFilter>();
        });
    }

    public class AuthorizeOperationFilter : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            var hasAuthorize = context.MethodInfo.DeclaringType != null &&
                              (context.MethodInfo.DeclaringType.GetCustomAttributes(true).OfType<AuthorizeAttribute>().Any() ||
                               context.MethodInfo.GetCustomAttributes(true).OfType<AuthorizeAttribute>().Any());

            var hasAnonymous = context.MethodInfo.DeclaringType != null &&
                              (context.MethodInfo.DeclaringType.GetCustomAttributes(true).OfType<AllowAnonymousAttribute>().Any() ||
                               context.MethodInfo.GetCustomAttributes(true).OfType<AllowAnonymousAttribute>().Any());

            var endpointMetadata = context.ApiDescription.ActionDescriptor.EndpointMetadata;
            var requiresAuth = endpointMetadata.Any(m => m is AuthorizeAttribute) || hasAuthorize;
            var allowsAnonymous = endpointMetadata.Any(m => m is AllowAnonymousAttribute) || hasAnonymous;

            if (requiresAuth && !allowsAnonymous)
            {
                operation.Security =
                [
                    new OpenApiSecurityRequirement
                    {
                        {
                            new OpenApiSecurityScheme
                            {
                                Reference = new OpenApiReference
                                {
                                    Type = ReferenceType.SecurityScheme,
                                    Id = "Bearer"
                                }
                            },
                            Array.Empty<string>()
                        }
                    }
                ];
            }
        }
    }
}
