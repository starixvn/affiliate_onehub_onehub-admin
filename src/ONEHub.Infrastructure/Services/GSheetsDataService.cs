using System.Text.Json;
using Microsoft.Extensions.Options;
using ONEHub.Application.Services;
using ONEHub.Domain.Constants;
using ONEHub.Domain.Entities;
using ONEHub.Domain.Enums;
using ONEHub.Domain.Errors;
using ONEHub.Domain.Params;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;
using ONEHub.Domain.Settings;

namespace ONEHub.Infrastructure.Services;

public class GSheetsDataService(
    IGSheetsService gSheetsService,
    IGSheetsDomainRepository repository,
    IOptions<GSheetsSettings> settings,
    IRabbitBus rabbitBus,
    ILogProvider logger) : IGSheetsDataService
{
    private static readonly JsonSerializerOptions JsonSerializerOptions = new()
    {
        WriteIndented = true
    };

    private readonly GSheetsSettings _settings = settings.Value;

    public async Task<Result> PublishDataAsync(GSheetsQueueParam param)
    {
        var isSuccess = await rabbitBus.PublishAsync(param);
        if (!isSuccess)
        {
            logger.LogFileMessage($"RabbitMQ publish failed for {param.RequestId}, processing directly");
            return await ProcessDataAsync(param);
        }

        return Result.Success();
    }

    public async Task<Result> ProcessDataAsync(GSheetsQueueParam param)
    {
        try
        {
            if (param.ActionType == GSheetActionType.Get)
            {
                var sheetsInfo = _settings.GetGSheetsInfos.Find(i => i.SheetsId == param.GSheetType)!;
                if (sheetsInfo.IsFetch)
                {
                    var getGSheetsParam = new GetGSheetsDataParam
                    {
                        SpreadsheetId = sheetsInfo.SpreadsheetId,
                        DomainType = sheetsInfo.SheetsId,
                        HeaderRowIndex = sheetsInfo.HeaderRowIndex,
                        Range = sheetsInfo.Range,
                        SheetsName = sheetsInfo.SheetsName
                    };

                    return await ProcessGetTypeAsync(getGSheetsParam);
                }

                return Result.Success();
            }

            if (param.ActionType == GSheetActionType.Put)
            {
                var sheetsInfo = _settings.PutGSheetsInfos.Find(i => i.SheetsId == param.GSheetType)!;
                if (sheetsInfo.IsFetch)
                {
                    var putParam = await BuildPutGSheetsDataParam(sheetsInfo, param);
                    await Task.Delay(TimeSpan.FromSeconds(1));

                    await ProcessPutTypeAsync(putParam);
                }

                return Result.Success();
            }

            return Result.Failure(GSheetsError.ProcessDataFailed);
        }
        catch (Exception ex)
        {
            await logger.SentryErrorAsync(GSheetsError.ProcessDataFailed.Message, ex);
            return Result.Failure(GSheetsError.ProcessDataFailed);
        }
    }

    private async Task<Result> ProcessGetTypeAsync(GetGSheetsDataParam param)
    {
        var data = await GetProcessedSheetsDataAsync(param);
        var jsonResult = JsonSerializer.Serialize(data, JsonSerializerOptions);

        var insertParam = new CreateGSheetsDomainParam
        {
            Data = jsonResult,
            DomainType = param.DomainType,
            SiteId = 101 // TODO: get from settings
        };

        return await repository.CreateGSheetsDomainAsync(insertParam);
    }

    private async Task ProcessPutTypeAsync(PutGSheetsDataParam param) => await gSheetsService.UpdateCellAsync(param);

    private async Task<List<GSheetsDomain>> GetProcessedSheetsDataAsync(GetGSheetsDataParam param)
    {
        var rawData = await gSheetsService.GetGSheetsDataAsync(param);
        var formatData = GetFormatData(rawData, param.HeaderRowIndex);

        return [.. formatData
            .Select(row => new GSheetsDomain
            {
                DmN = BuildDomainName(row),
                Nt = row.GetValueOrDefault(GSheets.NoteColumn, string.Empty),
                Dts = BuildCountryScores(row)
            })];
    }

    private static List<Dictionary<string, string>> GetFormatData(IList<IList<object>> rawData, int headerRowIndex, bool skipCondition = false)
    {
        var headerRow = rawData[headerRowIndex - GSheets.HeaderRowOffset];
        var headers = MapHeaders(headerRow);

        var formatData = rawData
            .Skip(headerRowIndex)
            .Select(row => BuildRowDictionary(headers, row))
            .Where(d => skipCondition || RowIsValid(d))
            .ToList();

        return formatData;
    }

    private static List<string> MapHeaders(IList<object> headerRow)
    {
        return headerRow
            .Select(h =>
            {
                var text = h.ToString() ?? string.Empty;
                return GSheets.MappingCols
                           .FirstOrDefault(kvp => kvp.Value == text).Key
                       ?? text;
            })
            .ToList();
    }

    private static Dictionary<string, string> BuildRowDictionary(
        List<string> headers,
        IList<object> row)
    {
        return headers
            .Zip(row.Select(c => c.ToString() ?? string.Empty))
            .ToDictionary(x => x.First, x => x.Second);
    }

    private static bool RowIsValid(Dictionary<string, string> row)
    {
        if (!string.IsNullOrWhiteSpace(row.GetValueOrDefault(GSheets.NoteColumn)))
        {
            return false;
        }

        if (!row.GetValueOrDefault(GSheets.StatusColumn, string.Empty)
                .Equals(GSheets.EnabledStatus, StringComparison.OrdinalIgnoreCase))
        {
            return false;
        }

        foreach (var country in GSheets.CountryCodes)
        {
            var valueStr = row.GetValueOrDefault(country, GSheets.DefaultRateValue);
            if (int.TryParse(valueStr, out var value) && value < GSheets.MaxAcceptableRate)
            {
                return true;
            }
        }

        return false;
    }

    private static string BuildDomainName(Dictionary<string, string> row)
    {
        var sub = row.GetValueOrDefault(GSheets.SubDomainColumn, string.Empty);
        var link = row.GetValueOrDefault(GSheets.ShortLinkColumn, string.Empty);

        if (!string.IsNullOrWhiteSpace(sub)
            && !string.IsNullOrWhiteSpace(link))
        {
            return $"{sub}.{link}";
        }

        return row.GetValueOrDefault(GSheets.DomainNameColumn, string.Empty);
    }

    private static List<GSheetsCountry> BuildCountryScores(Dictionary<string, string> row)
    {
        var result = new List<GSheetsCountry>(GSheets.CountryCodes.Length);

        foreach (var cc in GSheets.CountryCodes)
        {
            var raw = row.GetValueOrDefault(cc, GSheets.DefaultRateValue);

            if (int.TryParse(raw, out var score))
            {
                result.Add(new GSheetsCountry
                {
                    CC = cc,
                    Sc = score
                });
            }
        }

        return result;
    }

    private async Task<PutGSheetsDataParam> BuildPutGSheetsDataParam(PutGSheetsInfo sheetsInfo, GSheetsQueueParam queueParam)
    {
        var rawData = await gSheetsService.GetGSheetsDataAsync(new GetGSheetsDataParam
        {
            SpreadsheetId = sheetsInfo.SpreadsheetId,
            Range = sheetsInfo.Range,
            SheetsName = sheetsInfo.SheetsName
        });

        var formatData = GetFormatData(rawData, sheetsInfo.HeaderRowIndex, true);

        var domainName = queueParam.DomainName;
        var noteValue = queueParam.Note;
        var rowIndex = -1;
        for (var i = 0; i < formatData.Count; i++)
        {
            var rowDomainName = BuildDomainName(formatData[i]);
            if (rowDomainName == domainName)
            {
                rowIndex = i + sheetsInfo.HeaderRowIndex + 1;
                break;
            }
        }

        if (rowIndex == -1)
        {
            throw new InvalidOperationException($"Domain name '{domainName}' not found in sheet '{sheetsInfo.SheetsName}'");
        }

        return new PutGSheetsDataParam
        {
            SpreadsheetId = sheetsInfo.SpreadsheetId,
            SheetsName = sheetsInfo.SheetsName,
            Row = rowIndex,
            Column = sheetsInfo.InputColumn,
            Value = noteValue
        };
    }
}
