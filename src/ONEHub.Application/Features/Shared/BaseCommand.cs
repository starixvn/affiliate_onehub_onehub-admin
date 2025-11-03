using MediatR;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Features.Shared;

public abstract class BaseCommand<TResponse> : IRequest<Result<TResponse>>, IRequiresUserContext where TResponse : class
{
    public string Ip { get; set; } = string.Empty;

    public string Host { get; set; } = string.Empty;

    public int UserId { get; set; }
}

public abstract class BaseNonResultCommand : IRequest<Result>, IRequiresUserContext
{
    public string Ip { get; set; } = string.Empty;

    public string Host { get; set; } = string.Empty;

    public int UserId { get; set; }
}
