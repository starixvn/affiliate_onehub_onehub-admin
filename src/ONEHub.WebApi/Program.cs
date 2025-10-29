using ONEHub.WebApi.Startup;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

builder.Host.UseSerilog();
builder.Services.AddDependencyInjection(builder.Configuration);

try
{
    Log.Information("Starting ONEHub Admin API");
    var app = builder.Build();

    app.UseExceptionHandler(options => { });

    app.UseHttpRequestLogging();

    app.UseCors();

    app.UsePing();

    app.UseForwardedHeaders();

    app.UseHealthCheck(builder.Configuration);

    app.UseSwagger(builder.Configuration);

    app.UseRewriter(builder.Configuration);

    app.UseStaticFiles(builder.Configuration);

    app.UseSession();

    app.UseAuthentication();
    app.UseAuthorization();

    app.MapControllers();

    app.MapFallbackToFile("/index.html");
    await app.RunAsync();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}
