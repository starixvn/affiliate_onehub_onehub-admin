using MediatR;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Features.Shared;

public abstract class BaseQuery<TResponse> : IRequest<Result<TResponse>>, IRequiresUserContext where TResponse : class
{
    public int UserId { get; set; }

    public string Ip { get; set; } = string.Empty;

    public string Host { get; set; } = string.Empty;
}
