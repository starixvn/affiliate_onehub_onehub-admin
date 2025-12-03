using System.Net;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Http;
using Google.Apis.Services;
using Google.Apis.Sheets.v4;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ONEHub.Application.Services;
using ONEHub.Domain.Settings;
using ONEHub.Infrastructure.Services;
using IHttpClientFactory = Google.Apis.Http.IHttpClientFactory;

namespace ONEHub.Infrastructure.Configurations;

public class TimeoutHttpClientFactory(int timeoutSeconds) : IHttpClientFactory
{
    public ConfigurableHttpClient CreateHttpClient(CreateHttpClientArgs args)
    {
        var handler = new HttpClientHandler();
        var configurableHandler = new ConfigurableMessageHandler(handler)
        {
            ApplicationName = args.ApplicationName
        };

        GSheetsServiceInstaller.AddInitializers(configurableHandler, args.Initializers);

        var httpClient = new ConfigurableHttpClient(configurableHandler)
        {
            Timeout = TimeSpan.FromSeconds(timeoutSeconds)
        };

        return httpClient;
    }
}

public class ProxyHttpClientFactory(IWebProxy proxy, int timeoutSeconds = 300) : IHttpClientFactory
{
    public ConfigurableHttpClient CreateHttpClient(CreateHttpClientArgs args)
    {
        var handler = new HttpClientHandler
        {
            Proxy = proxy,
            UseProxy = true
        };

        var configurableHandler = new ConfigurableMessageHandler(handler)
        {
            ApplicationName = args.ApplicationName
        };

        GSheetsServiceInstaller.AddInitializers(configurableHandler, args.Initializers);

        // Create ConfigurableHttpClient with custom timeout
        var httpClient = new ConfigurableHttpClient(configurableHandler)
        {
            Timeout = TimeSpan.FromSeconds(timeoutSeconds)
        };

        return httpClient;
    }
}

public class GSheetsServiceInstaller : IServiceInstaller
{
    internal static void AddInitializers(ConfigurableMessageHandler handler, IEnumerable<IConfigurableHttpClientInitializer>? initializers)
    {
        if (initializers is null)
        {
            return;
        }

        foreach (var initializer in initializers)
        {
            if (initializer is IHttpExecuteInterceptor executeInterceptor)
            {
                handler.AddExecuteInterceptor(executeInterceptor);
            }
            else if (initializer is IHttpUnsuccessfulResponseHandler unsuccessfulResponseHandler)
            {
                handler.AddUnsuccessfulResponseHandler(unsuccessfulResponseHandler);
            }
            else
            {
                // Other initializer types are not supported in this context
            }
        }
    }

    public void Install(IServiceCollection services, IConfiguration configuration)
    {
        var gSheetsSettings = configuration.GetSection(GSheetsSettings.SettingName).Get<GSheetsSettings>();
        ArgumentNullException.ThrowIfNull(gSheetsSettings);

        if (!File.Exists(gSheetsSettings.CredentialPath))
        {
            throw new FileNotFoundException("GSheets service account credential file not found", gSheetsSettings.CredentialPath);
        }

        services.AddSingleton<IGSheetsService>(_ =>
        {
            using var stream = new FileStream(gSheetsSettings.CredentialPath, FileMode.Open, FileAccess.Read);
#pragma warning disable CS0618
            var credential = GoogleCredential.FromStream(stream).CreateScoped(gSheetsSettings.Scopes);
#pragma warning restore CS0618

            IHttpClientFactory httpClientFactory;
            if (!string.IsNullOrEmpty(gSheetsSettings.ProxyUrl))
            {
                var proxy = new WebProxy(gSheetsSettings.ProxyUrl);
                httpClientFactory = new ProxyHttpClientFactory(proxy, gSheetsSettings.TimeoutSeconds);
            }
            else
            {
                httpClientFactory = new TimeoutHttpClientFactory(gSheetsSettings.TimeoutSeconds);
            }

            credential = credential.CreateWithHttpClientFactory(httpClientFactory);

            var initializer = new BaseClientService.Initializer
            {
                HttpClientInitializer = credential,
                ApplicationName = gSheetsSettings.ApplicationName,
                HttpClientFactory = httpClientFactory,
                DefaultExponentialBackOffPolicy = ExponentialBackOffPolicy.None
            };

            return new GSheetsService(new SheetsService(initializer));
        });

        services.AddSingleton<IGSheetsDataService, GSheetsDataService>();
    }
}
