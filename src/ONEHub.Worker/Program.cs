using Fanex.Logging;
using ONEHub.Worker.Startup;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDependencyInjection(builder.Configuration);

try
{
    LogService.Info("Starting ONEHub Worker");
    var app = builder.Build();

    app.UseExceptionHandler(_ => { });

    app.UseForwardedHeaders();

    app.MapGet("/", () => "ONEHub Worker is running");

    app.MapControllers();

    await app.RunAsync();
}
catch (Exception ex)
{
    LogService.Error("Worker terminated unexpectedly", ex);
}
