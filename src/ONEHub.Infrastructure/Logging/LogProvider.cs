using ONEHub.Domain.Interfaces;
using Serilog;

namespace ONEHub.Infrastructure.Logging;

public class LogProvider : ILogProvider
{
    private readonly Fanex.Logging.ILogger _fanexLogger;

    public LogProvider(Fanex.Logging.ILogger fanexLogger)
    {
        _fanexLogger = fanexLogger;
    }

    public void LogFileError(Exception exception)
    {
        Log.Error(exception, "An error occurred");
    }

    public void LogFileMessage(string message)
    {
        Log.Information(message);
    }

    public void LogFileMessageWithProperties(string message, Dictionary<string, object> properties)
    {
        Log.Information("{Message} {@Properties}", message, properties);
    }

    public async Task SentryErrorAsync(string errMsg, Exception exception)
    {
        await _fanexLogger.ErrorAsync(errMsg, exception);
    }

    public async Task SentryErrorAsync(string errMsg)
    {
        await _fanexLogger.ErrorAsync(errMsg);
    }

    public async Task SentryErrorAsync(Exception exception)
    {
        await _fanexLogger.ErrorAsync(exception.ToString());
    }

    public async Task SentryInfoAsync(string info)
    {
        await _fanexLogger.InfoAsync(info);
    }
}

