using ONEHub.Domain.Params;
using ONEHub.Domain.Results;

namespace ONEHub.Domain.Repositories;

public interface ILinkGeneratorRepository
{
    Task<Result<string>> InsertLinkAsync(InsertLinkParam param);
}
