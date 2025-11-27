using Google.Apis.Sheets.v4;
using Google.Apis.Sheets.v4.Data;
using ONEHub.Application.Services;
using ONEHub.Domain.Constants;
using ONEHub.Domain.Params;

namespace ONEHub.Infrastructure.Services;

public class GSheetsService(
    SheetsService sheetsService) : IGSheetsService
{
    public async Task<IList<IList<object>>> GetGSheetsDataAsync(GetGSheetsDataParam param)
    {
        var range = $"{param.SheetsName}!{param.Range}";
        var request = sheetsService.Spreadsheets.Values.Get(param.SpreadsheetId, range);

        var response = await request.ExecuteAsync();
        var values = response.Values is { Count: > GSheets.MinimumDataRows }
            ? response.Values
            : null;

        if (values is null)
        {
            return [];
        }

        return values;
    }

    public async Task UpdateCellAsync(PutGSheetsDataParam param)
    {
        var range = $"{param.SheetsName}!{param.Column}{param.Row}";
        var valueRange = new ValueRange
        {
            Values = [[param.Value]]
        };

        var request = sheetsService.Spreadsheets.Values.Update(valueRange, param.SpreadsheetId, range);
        request.ValueInputOption = SpreadsheetsResource.ValuesResource.UpdateRequest.ValueInputOptionEnum.USERENTERED;

        await request.ExecuteAsync();
    }
}
