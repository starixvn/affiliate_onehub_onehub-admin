using MediatR;
using ONEHub.Domain.Common;

namespace ONEHub.Application.Common;

public abstract class BaseCommand<TResponse> : IRequest<TResponse>
{
    public int UserId { get; set; }
    public string IpAddress { get; set; } = string.Empty;
}

public abstract class BaseCommand : BaseCommand<ResultInfo>
{
}

