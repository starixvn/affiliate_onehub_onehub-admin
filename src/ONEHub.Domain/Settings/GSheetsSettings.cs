namespace ONEHub.Domain.Settings;

public class GSheetsSettings
{
    public const string SettingName = "GoogleSheets";

    public string[] Scopes { get; set; }

    public string ApplicationName { get; set; }

    public string CredentialPath { get; set; }

    public string? ProxyUrl { get; set; }

    public int TimeoutSeconds { get; set; } = 30;

    public List<GetGSheetsInfo> GetGSheetsInfos { get; set; }

    public List<PutGSheetsInfo> PutGSheetsInfos { get; set; }
}

public class SheetsInfo
{
    public string SpreadsheetId { get; set; }

    public string SheetsName { get; set; }

    public int HeaderRowIndex { get; set; }

    public string Range { get; set; }

    public bool IsFetch { get; set; }

    public byte SheetsId { get; set; }
}

public class GetGSheetsInfo : SheetsInfo
{
}

public class PutGSheetsInfo : SheetsInfo
{
    public string InputColumn { get; set; }
}
