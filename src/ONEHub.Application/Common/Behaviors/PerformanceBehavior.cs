using MediatR;
using Microsoft.Extensions.Logging;
using System.Diagnostics;

namespace ONEHub.Application.Common.Behaviors;

public class PerformanceBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    private readonly ILogger<PerformanceBehavior<TRequest, TResponse>> _logger;
    private const int SlowRequestThresholdMs = 500;

    public PerformanceBehavior(ILogger<PerformanceBehavior<TRequest, TResponse>> logger)
    {
        _logger = logger;
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        var stopwatch = Stopwatch.StartNew();

        var response = await next();

        stopwatch.Stop();

        if (stopwatch.ElapsedMilliseconds > SlowRequestThresholdMs)
        {
            var requestName = typeof(TRequest).Name;

            _logger.LogWarning(
                "Slow Request Detected: {RequestName} - Elapsed: {ElapsedMilliseconds}ms - Threshold: {ThresholdMs}ms - Request: {@Request}",
                requestName,
                stopwatch.ElapsedMilliseconds,
                SlowRequestThresholdMs,
                request);
        }

        return response;
    }
}

