using ONEHub.Domain.Params;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Services;

public interface IGSheetsDataService
{
    Task<Result> PublishDataAsync(GSheetsQueueParam param);

    Task<Result> ProcessDataAsync(GSheetsQueueParam param);
}
