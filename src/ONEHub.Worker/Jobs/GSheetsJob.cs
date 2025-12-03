using Microsoft.Extensions.Options;
using ONEbook.UM.Services;
using ONEHub.Application.Services;
using ONEHub.Domain.Constants;
using ONEHub.Domain.Params;
using ONEHub.Domain.Settings;

namespace ONEHub.Worker.Jobs;

public class GSheetsJob(
    IMaintenanceService maintenanceService,
    IGSheetsDataService service,
    IOptions<JobSettings> settings,
    ILogProvider logger)
    : BackgroundService
{
    private readonly TimeSpan _interval = TimeSpan.FromMinutes(settings.Value.GoogleSheetsIntervalMinutes);

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        logger.LogFileMessage($"GSheetsJob started {DateTimeOffset.Now}");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                if (await maintenanceService.IsUnderMaintenanceAsync())
                {
                    await logger.SentryInfoAsync("System is currently unavailable due to scheduled maintenance!");
                    continue;
                }

                foreach (var dt in GSheets.GetDomainTypes)
                {
                    await ProcessDomainTypeAsync(dt);
                }
            }
            catch (Exception ex)
            {
                await logger.SentryErrorAsync("Error in GSheetsJob", ex);
            }

            await Task.Delay(_interval, stoppingToken);
        }

        logger.LogFileMessage($"GSheetsJob stopped {DateTimeOffset.Now}");
    }

    private async Task ProcessDomainTypeAsync(int domainType)
    {
        var param = new GSheetsQueueParam { GSheetType = domainType };
        var result = await service.PublishDataAsync(param);

        if (result.IsFailure)
        {
            await logger.SentryErrorAsync($"PublishDataAsync failed for type {domainType}: {result.ErrorMessage}");
        }
    }

    public override async Task StopAsync(CancellationToken cancellationToken)
    {
        logger.LogFileMessage($"GSheetsJob is stopping {DateTimeOffset.Now}");
        await base.StopAsync(cancellationToken);
    }
}
