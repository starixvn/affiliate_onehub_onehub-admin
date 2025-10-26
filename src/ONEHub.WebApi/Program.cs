using System.Text;
using Fanex.Logging;
using Fanex.Logging.Sentry;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Rewrite;
using Microsoft.IdentityModel.Tokens;
using ONEHub.Application;
using ONEHub.Infrastructure;
using Sentry;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

builder.Host.UseSerilog((context, loggerConfiguration) =>
{
    loggerConfiguration.ReadFrom.Configuration(context.Configuration);
});

var env = builder.Configuration["Sentry:Environment"];
var backEndDsn = builder.Configuration["Sentry:Dsn"];
var category = builder.Configuration["Sentry:LogCategory"];

if (!string.IsNullOrEmpty(backEndDsn) && !string.IsNullOrEmpty(category))
{
    LogManager.SetDefaultLogCategory(category).Use(new List<ILogEngine>
    {
        new SentryLogging(new SentryEngineOptions
        {
            Dsn = new Dsn(backEndDsn),
            Environment = env
        })
    });
}
else
{
    LogManager.SetDefaultLogCategory("ONEHub.Admin.Default").Use(new List<ILogEngine>());
}

builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var secretKey = builder.Configuration["Jwt:SecretKey"]
            ?? throw new InvalidOperationException("JWT SecretKey not configured");

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
            ClockSkew = TimeSpan.Zero
        };

        // Read JWT token from HttpOnly cookie instead of Authorization header
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                // Try to get token from cookie first
                if (context.Request.Cookies.TryGetValue("accessToken", out var token))
                {
                    context.Token = token;
                }
                // Fallback to Authorization header for API testing (Swagger, Postman)
                else if (!string.IsNullOrEmpty(context.Request.Headers["Authorization"]))
                {
                    context.Token = context.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
                }

                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddStackExchangeRedisCache(options =>
{
    var redisConfig = builder.Configuration.GetSection("fanex.caching.redis");
    options.Configuration = redisConfig.GetValue<string>("ConnectionString");
    options.InstanceName = redisConfig.GetValue<string>("ApplicationName") + ":Session:";
});

builder.Services.AddSession(options =>
{
    options.Cookie.Name = "Fanex.Aff12BetAdminSession";
    options.IdleTimeout = TimeSpan.FromMinutes(20);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
    options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
    options.Cookie.SameSite = SameSiteMode.Lax;
});

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    // allow all origins, headers, and methods - adjust as needed for production
    options.AddDefaultPolicy(policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseSerilogRequestLogging();

//app.UseHttpsRedirection();

// URL Rewriting for extensionless HTML files
var rewriteOptions = new RewriteOptions()
    // Portal pages
    .AddRewrite(@"^portal/login$", "portal/login.html", skipRemainingRules: true)
    .AddRewrite(@"^portal/home$", "portal/home.html", skipRemainingRules: true)
    .AddRewrite(@"^portal/admin$", "portal/home.html", skipRemainingRules: true)  // Alias for home
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

app.UseDefaultFiles();

// Configure aggressive caching for static assets (JS, CSS, images)
app.UseStaticFiles(new StaticFileOptions
{
    OnPrepareResponse = ctx =>
    {
        var path = ctx.File.Name.ToLower();

        // Cache JavaScript and CSS files for 1 year (with cache busting via query params)
        if (path.EndsWith(".js") || path.EndsWith(".css"))
        {
            ctx.Context.Response.Headers.Append("Cache-Control", "public,max-age=31536000,immutable");
        }
        // Cache images for 1 month
        else if (path.EndsWith(".jpg") || path.EndsWith(".jpeg") ||
                 path.EndsWith(".png") || path.EndsWith(".gif") ||
                 path.EndsWith(".webp") || path.EndsWith(".svg") ||
                 path.EndsWith(".ico"))
        {
            ctx.Context.Response.Headers.Append("Cache-Control", "public,max-age=2592000");
        }
        // Cache fonts for 1 year
        else if (path.EndsWith(".woff") || path.EndsWith(".woff2") ||
                 path.EndsWith(".ttf") || path.EndsWith(".eot"))
        {
            ctx.Context.Response.Headers.Append("Cache-Control", "public,max-age=31536000,immutable");
        }
        // HTML files - no cache (always check for updates)
        else if (path.EndsWith(".html"))
        {
            ctx.Context.Response.Headers.Append("Cache-Control", "no-cache,no-store,must-revalidate");
            ctx.Context.Response.Headers.Append("Pragma", "no-cache");
            ctx.Context.Response.Headers.Append("Expires", "0");
        }
    }
});

app.UseCors();

app.UseSession();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapGet("/health", () => Results.Ok(new { status = "Healthy", timestamp = DateTime.UtcNow }))
    .WithName("HealthCheck");

app.MapFallbackToFile("/index.html");

try
{
    Log.Information("Starting ONEHub Admin API");
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}
