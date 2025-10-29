namespace ONEHub.Domain.Interfaces;

public interface ILogProvider
{
    void LogFileError(Exception exception);
    void LogFileMessage(string message);
    void LogFileMessageWithProperties(string message, Dictionary<string, object> properties);
    Task SentryErrorAsync(string errMsg, Exception exception);
    Task SentryErrorAsync(string errMsg);
    Task SentryErrorAsync(Exception exception);
    Task SentryInfoAsync(string info);
}

