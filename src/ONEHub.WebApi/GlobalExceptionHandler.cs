using System.Net;
using Microsoft.AspNetCore.Diagnostics;
using ONEHub.Application.Utils;
using ILogger = Fanex.Logging.ILogger;

namespace ONEHub.WebApi;

public class GlobalExceptionHandler(ILogger logger) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        httpContext.Request.EnableBuffering();
        var errorMsg = LoggerUtils.GenerateMessage(exception, httpContext);
        await logger.ErrorAsync(errorMsg);

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
