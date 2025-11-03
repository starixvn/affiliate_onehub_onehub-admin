using ONEHub.Application.Services;

namespace ONEHub.Infrastructure.Services;
public class SystemDateTimeProvider : IDateTimeProvider
{
    public DateTime UtcNow => DateTimeOffset.UtcNow.UtcDateTime;

    public DateTime MinValue => DateTimeOffset.MinValue.DateTime;
}

