using Google.Apis.Auth.OAuth2;
using Google.Apis.Services;
using Google.Apis.Sheets.v4;
using ONEHub.Application.Services;
using ONEHub.Domain.Settings;
using ONEHub.Infrastructure.Services;

namespace ONEHub.WebApi.Configurations;

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

            var sheetsService = new SheetsService(new BaseClientService.Initializer
            {
                HttpClientInitializer = credential,
                ApplicationName = gSheetsSettings.ApplicationName,
            });

            return new GSheetsService(sheetsService);
        });

        services.AddSingleton<IGSheetsDataService, GSheetsDataService>();
    }
}
