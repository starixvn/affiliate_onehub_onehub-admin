using System.Net.Mime;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.Rewrite;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Net.Http.Headers;
using Newtonsoft.Json;
using ONEHub.Domain.Settings;
using ONEHub.WebApi.Features.Auth;
using ONEHub.WebApi.Features.Campaign;
using ONEHub.WebApi.Features.Component;
using ONEHub.WebApi.Features.GenerateLink;
using ONEHub.WebApi.Features.Settings;
using Serilog;
using Serilog.Events;

namespace ONEHub.WebApi.Startup;

public static class WebApplicationSetup
{
    public static WebApplication UseSwagger(this WebApplication app, IConfiguration configuration)
    {
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI(options =>
            {
                options.EnableTryItOutByDefault();
                options.SwaggerEndpoint("/swagger/v1/swagger.json", "ONEHub Admin Web API");
            });
        }

        return app;
    }

    public static WebApplication UseRewriter(this WebApplication app, IConfiguration configuration)
    {
        // URL Rewriting for extensionless HTML files
        var rewriteOptions = new RewriteOptions()
            // Portal pages
            .AddRewrite(@"^portal/login$", "portal/login.html", skipRemainingRules: true)
            .AddRewrite(@"^portal/home$", "portal/home.html", skipRemainingRules: true)
            .AddRewrite(@"^portal/admin$", "portal/home.html", skipRemainingRules: true) // Alias for home
            .AddRewrite(@"^portal/customer$", "portal/customer.html", skipRemainingRules: true)
            .AddRewrite(@"^portal/affiliate$", "portal/affiliate.html", skipRemainingRules: true)
            .AddRewrite(@"^portal/operation$", "portal/operation.html", skipRemainingRules: true)
            .AddRewrite(@"^portal/report$", "portal/report.html", skipRemainingRules: true)
            .AddRewrite(@"^portal/player$", "portal/player.html", skipRemainingRules: true)
            .AddRewrite(@"^portal/mediagallery$", "portal/mediagallery.html", skipRemainingRules: true)
            .AddRewrite(@"^portal/message$", "portal/message.html", skipRemainingRules: true)
            .AddRewrite(@"^portal/administrator$", "portal/administrator.html", skipRemainingRules: true)
            .AddRewrite(@"^portal/domain$", "portal/domain.html", skipRemainingRules: true)
            .AddRewrite(@"^portal/landingpage$", "portal/landingpage.html", skipRemainingRules: true)
            .AddRewrite(@"^portal/pagebuilder$", "portal/landingpage.html", skipRemainingRules: true)
            .AddRewrite(@"^portal/assetuploader$", "portal/landingpage.html", skipRemainingRules: true)
            .AddRewrite(@"^portal/formmanagement$", "portal/landingpage.html", skipRemainingRules: true)
            .AddRewrite(@"^portal/campaignmanagement$", "portal/campaignmanagement.html", skipRemainingRules: true)
            .AddRewrite(@"^portal/campaign-management$", "portal/campaign-management.html", skipRemainingRules: true)
            .AddRewrite(@"^portal/email-history$", "portal/email-history.html", skipRemainingRules: true)
            .AddRewrite(@"^portal/payment-request$", "portal/payment-request.html", skipRemainingRules: true)
            .AddRewrite(@"^portal/change-admin-password$", "portal/change-admin-password.html", skipRemainingRules: true)
            .AddRewrite(@"^portal/marketing-account$", "portal/marketing-account.html", skipRemainingRules: true)
            .AddRewrite(@"^portal/asset-modification$", "portal/asset-modification.html", skipRemainingRules: true)
            .AddRewrite(@"^portal/under-maintenance$", "portal/under-maintenance.html", skipRemainingRules: true);

        app.UseRewriter(rewriteOptions);
        return app;
    }

    public static WebApplication UseStaticFiles(this WebApplication app, IConfiguration configuration)
    {
        // Configure aggressive caching for static assets (JS, CSS, images)
        app.UseStaticFiles(new StaticFileOptions
        {
            OnPrepareResponse = ctx =>
            {
                const int OneYear = 60 * 60 * 24 * 365;
                ctx.Context.Response.Headers[HeaderNames.CacheControl] = app.Environment.IsDevelopment() ?
                    "no-cache" : "public,max-age=" + OneYear;
                ctx.Context.Response.Headers[HeaderNames.AccessControlAllowOrigin] = "*";
            }
        });
        return app;
    }

    public static WebApplication UseHealthCheck(this WebApplication app, IConfiguration configuration)
    {
        var appSetting = configuration.GetSection(AppSetting.SettingName).Get<AppSetting>();
        ArgumentNullException.ThrowIfNull(appSetting);

        app.UseHealthChecks("/WhoAmI", new HealthCheckOptions
        {
            AllowCachingResponses = false,
            ResponseWriter = CustomResponseWriter
        });

        return app;

        bool IsValidRequest(string? key, HttpContext context)
        {
            if (string.IsNullOrEmpty(key) || string.IsNullOrWhiteSpace(key))
            {
                return true;
            }

            return context.Request.Query.TryGetValue("AccessKey", out var value) && value.Equals(key);
        }

        async Task CustomResponseWriter(HttpContext context, HealthReport report)
        {
            if (!IsValidRequest(appSetting.AccessKey, context))
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                await context.Response.WriteAsync("Invalid or missing access key");
                return;
            }

            var result = JsonConvert.SerializeObject(new
            {
                status = report.Status.ToString(),
                monitors = report.Entries.Select(e => new
                {
                    name = e.Key,
                    status = Enum.GetName(typeof(HealthStatus), e.Value.Status),
                    description = e.Value.Description,
                    values = e.Value.Data
                })
            }, Formatting.Indented);

            context.Response.ContentType = MediaTypeNames.Application.Json;
            await context.Response.WriteAsync(result);
        }
    }

    public static WebApplication UsePing(this WebApplication app)
    {
        app.Use(async (context, next) =>
        {
            if (context.Request.Path.StartsWithSegments("/ping"))
            {
                context.Response.ContentType = "text/plain";
                await context.Response.WriteAsync("pong");
                return;
            }
            await next();
        });

        return app;
    }

    public static WebApplication UseFrameSecurity(this WebApplication app, IConfiguration configuration)
    {
        var appSetting = configuration.GetSection(AppSetting.SettingName).Get<AppSetting>();
        ArgumentNullException.ThrowIfNull(appSetting);

        app.Use(async (context, next) =>
        {
            var allowedDomains = appSetting.AllowedDomains;

            if (allowedDomains is not null && allowedDomains.Length > 0)
            {
                var formattedDomains = allowedDomains.Select(domain =>
                {
                    if (!domain.StartsWith("http://", StringComparison.OrdinalIgnoreCase)
                        && !domain.StartsWith("https://", StringComparison.OrdinalIgnoreCase))
                    {
                        return $"https://{domain}";
                    }
                    return domain;
                });

                var frameAncestors = string.Join(" ", formattedDomains);
                context.Response.Headers.Append("Content-Security-Policy", $"frame-ancestors {frameAncestors}");
            }

            await next();
        });

        return app;
    }

    public static WebApplication UseHttpRequestLogging(this WebApplication app)
    {
        app.UseSerilogRequestLogging(options =>
        {
            // ✅ Custom message template — includes elapsed time
            options.MessageTemplate = "HTTP {RequestMethod} {RequestPath}{QueryString} responded {StatusCode} in {Elapsed:0.0000} ms from {RemoteIpAddress} UA:{UserAgent}";

            // ✅ Enrich log context with useful request info
            options.EnrichDiagnosticContext = (diagnosticContext, httpContext) =>
            {
                diagnosticContext.Set("RequestMethod", httpContext.Request.Method);
                diagnosticContext.Set("RequestPath", httpContext.Request.Path);
                diagnosticContext.Set("QueryString", httpContext.Request.QueryString.ToString());
                diagnosticContext.Set("StatusCode", httpContext.Response.StatusCode);
                diagnosticContext.Set("RemoteIpAddress", httpContext.Connection.RemoteIpAddress?.ToString() ?? string.Empty);
                diagnosticContext.Set("UserAgent", httpContext.Request.Headers["User-Agent"].ToString());

                // Optionally add forwarded header or extra headers
                diagnosticContext.Set("X-Forwarded-For", httpContext.Request.Headers["x-forwarded-for"].ToString());
                diagnosticContext.Set("SecChUa", httpContext.Request.Headers["sec-ch-ua"].ToString());
            };

            // ✅ Control log level by response time or errors
            options.GetLevel = (_, elapsed, ex) =>
            {
                if (ex != null)
                {
                    return LogEventLevel.Error;
                }

                // Mark slow requests as warnings (e.g., > 2 seconds)
                if (elapsed > 2000)
                {
                    return LogEventLevel.Warning;
                }

                return LogEventLevel.Information;
            };
        });
        return app;
    }

    public static WebApplication MapEndpoint(this WebApplication app)
    {
        app.RegisterAuthEndpoints();
        app.RegisterCampaignEndpoints();
        app.RegisterComponentEndpoints();
        app.RegisterGenerateLinkEndpoints();
        app.RegisterSettingsEndpoints();
        return app;
    }
}
