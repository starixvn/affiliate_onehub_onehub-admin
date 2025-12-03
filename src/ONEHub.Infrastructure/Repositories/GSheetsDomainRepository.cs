using Fanex.Data.Repository;
using ONEHub.Domain.Errors;
using ONEHub.Domain.Params;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;
using ONEHub.Infrastructure.Repositories.Commands;

namespace ONEHub.Infrastructure.Repositories;

public class GSheetsDomainRepository(
    IDynamicRepository dynamicRepository) : IGSheetsDomainRepository
{
    public async Task<Result> CreateGSheetsDomainAsync(CreateGSheetsDomainParam param)
    {
        var command = new CreateGSheetsDomainCommand
        {
            Data = param.Data,
            DomainType = param.DomainType,
            SiteId = param.SiteId
        };

        _ = await dynamicRepository.ExecuteAsync(command);
        if (command.ErrCode != 0 || !string.IsNullOrWhiteSpace(command.ErrMsg))
        {
            return Result.Failure(new Error(command.ErrCode, command.ErrMsg));
        }

        return Result.Success();
    }
}
