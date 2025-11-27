using ONEHub.Application.Services;
using Serilog;

namespace ONEHub.Infrastructure.Services;

public class LogProvider(Fanex.Logging.ILogger logger) : ILogProvider
{
    public void LogFileError(Exception exception, string message)
        => Log.Error(exception, message);

    public void LogFileMessage(string message)
        => Log.Information(message);

    public void LogFileMessageWithProperties(string message, Dictionary<string, object> properties)
        => Log.Information("{Message} {@Properties}", message, properties);

    public async Task SentryErrorAsync(string errMsg, Exception exception)
        => await logger.ErrorAsync(errMsg, exception);

    public async Task SentryErrorAsync(string errMsg)
        => await logger.ErrorAsync(errMsg);

    public async Task SentryErrorAsync(Exception exception)
        => await logger.ErrorAsync(exception.ToString());

    public async Task SentryInfoAsync(string info)
        => await logger.InfoAsync(info);
}
