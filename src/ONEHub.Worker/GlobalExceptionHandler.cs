using System.Net;
using Microsoft.AspNetCore.Diagnostics;
using ONEHub.Application.Services;
using ONEHub.Application.Utils;

namespace ONEHub.Worker;

public class GlobalExceptionHandler(ILogProvider logger) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        httpContext.Request.EnableBuffering();
        var errorMsg = LoggerUtils.GenerateMessage(exception, httpContext);
        await logger.SentryErrorAsync(errorMsg);

        httpContext.Response.Clear();
        httpContext.Response.ContentType = "application/json";
        httpContext.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
        await httpContext.Response.WriteAsJsonAsync(new
        {
            httpContext.Response.StatusCode,
            exception.Message
        }, cancellationToken: cancellationToken);

        return true;
    }
}
