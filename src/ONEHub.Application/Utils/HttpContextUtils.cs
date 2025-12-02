using Microsoft.AspNetCore.Http;

namespace ONEHub.Application.Utils;

public static class HttpContextUtils
{
    public static string GetCookie(HttpContext? httpContext, string key)
    {
        ArgumentNullException.ThrowIfNull(httpContext);
        var request = httpContext.Request;
        return request.Cookies.TryGetValue(key, out var value) ? value : string.Empty;
    }

    public static void SetCookie(HttpContext? httpContext, string key, string value, CookieOptions? options = null)
    {
        ArgumentNullException.ThrowIfNull(httpContext);
        var response = httpContext.Response;
        options ??= new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Lax,
            Path = "/",
            Expires = DateTimeOffset.UtcNow.AddDays(30)
        };

        response.Cookies.Append(key, value, options);
    }

    public static void ClearCookie(HttpContext? httpContext, string key)
    {
        ArgumentNullException.ThrowIfNull(httpContext);
        var response = httpContext.Response;
        response.Cookies.Delete(key);
    }
}
