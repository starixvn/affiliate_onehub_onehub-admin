using MediatR;
using Microsoft.Extensions.Logging;

namespace ONEHub.Application.Common.Behaviors;

public class TransactionBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    private readonly ILogger<TransactionBehavior<TRequest, TResponse>> _logger;

    public TransactionBehavior(ILogger<TransactionBehavior<TRequest, TResponse>> logger)
    {
        _logger = logger;
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        if (!ShouldWrapInTransaction(request))
        {
            return await next();
        }

        var requestName = typeof(TRequest).Name;

        _logger.LogInformation(
            "Beginning transaction for {RequestName}",
            requestName);

        try
        {
            var response = await next();

            _logger.LogInformation(
                "Transaction completed successfully for {RequestName}",
                requestName);

            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Transaction failed for {RequestName} - Rolling back",
                requestName);

            throw;
        }
    }

    private static bool ShouldWrapInTransaction(TRequest request)
    {
        return request is BaseCommand<TResponse> or BaseCommand;
    }
}

