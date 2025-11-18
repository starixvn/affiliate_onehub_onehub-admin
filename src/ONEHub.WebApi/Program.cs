using Fanex.Logging;
using ONEHub.WebApi.Startup;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

builder.Host.UseSerilog();
builder.Services.AddDependencyInjection(builder.Configuration);

try
{
    LogService.Info("Starting ONEHub Admin API");
    var app = builder.Build();

    app.UseExceptionHandler(_ => { });

    app.UseHttpRequestLogging();

    app.UseCors();

    app.UseFrameSecurity(builder.Configuration);

    app.UsePing();

    app.UseForwardedHeaders();

    app.UseHealthCheck(builder.Configuration);

    app.UseSwagger(builder.Configuration);

    app.UseRewriter(builder.Configuration);

    app.UseStaticFiles(builder.Configuration);

    app.UseAuthentication();
    app.UseAuthorization();

    app.MapEndpoint();

    app.MapFallbackToFile("/index.html");
    await app.RunAsync();
}
catch (Exception ex)
{
    LogService.Critical("Application terminated unexpectedly", ex);
}
