using MediatR;

namespace ONEHub.Application.Common;

public abstract class BaseQuery<TResponse> : IRequest<TResponse>
{
    public int UserId { get; set; }
}

