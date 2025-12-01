using System.Net;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Http;
using Google.Apis.Services;
using Google.Apis.Sheets.v4;
using ONEHub.Application.Services;
using ONEHub.Domain.Settings;
using ONEHub.Infrastructure.Services;

namespace ONEHub.Worker.Configurations;

public class ProxyHttpClientFactory(HttpClientHandler handler) : Google.Apis.Http.IHttpClientFactory
{
    public ConfigurableHttpClient CreateHttpClient(CreateHttpClientArgs args) => new(new ConfigurableMessageHandler(handler));
}

public class GSheetsServiceInstaller : IServiceInstaller
{
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
            var credential = GoogleCredential
                .FromServiceAccountCredential(ServiceAccountCredential.FromServiceAccountData(stream))
                .CreateScoped(gSheetsSettings.Scopes);

            var initializer = new BaseClientService.Initializer
            {
                HttpClientInitializer = credential,
                ApplicationName = gSheetsSettings.ApplicationName,
            };

            // Configure proxy if specified
            if (!string.IsNullOrEmpty(gSheetsSettings.ProxyUrl))
            {
                var handler = new HttpClientHandler
                {
                    Proxy = new WebProxy(gSheetsSettings.ProxyUrl, true),
                    UseProxy = true
                };

                initializer.HttpClientFactory = new ProxyHttpClientFactory(handler);
            }

            var sheetsService = new SheetsService(initializer);

            return new GSheetsService(sheetsService);
        });

        services.AddSingleton<IGSheetsDataService, GSheetsDataService>();
    }
}
