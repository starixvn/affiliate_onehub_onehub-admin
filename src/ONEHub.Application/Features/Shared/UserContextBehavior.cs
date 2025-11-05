using MediatR;
using Microsoft.AspNetCore.Http;
using ONEHub.Application.Services;

namespace ONEHub.Application.Features.Shared;

public class UserContextBehavior<TRequest, TResponse>(
    IHttpContextAccessor httpContextAccessor,
    ICurrentUserService currentUserService)
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        if (request is not IRequiresUserContext userContextRequest)
        {
            return await next();
        }

        var httpContext = httpContextAccessor.HttpContext;
        if (httpContext is null)
        {
            return await next();
        }

        if (userContextRequest.UserId <= 0)
        {
            userContextRequest.UserId = currentUserService.GetUserId();
        }

        userContextRequest.Ip = httpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown";
        userContextRequest.Host = httpContext.Request.Host.Host;

        return await next();
    }
}
