using ONEHub.Domain.Params;

namespace ONEHub.Application.Services;

public interface IGSheetsService
{
    Task<IList<IList<object>>> GetGSheetsDataAsync(GetGSheetsDataParam param);

    Task UpdateCellAsync(PutGSheetsDataParam param);
}
