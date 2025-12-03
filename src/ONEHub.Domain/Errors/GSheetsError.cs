namespace ONEHub.Domain.Errors;

public static class GSheetsError
{
    public static readonly Error ProcessDataFailed = new Error(501, "Failed to process Google Sheets data");
}
