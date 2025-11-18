using ONEHub.Domain.Params;
using ONEHub.Domain.Results;

namespace ONEHub.Domain.Repositories;

public interface ILinkGeneratorRepository
{
    Task<Result> InsertLinkAsync(InsertLinkParam param);
    Task<Result<string>> GetIDCodeAsync();
}
