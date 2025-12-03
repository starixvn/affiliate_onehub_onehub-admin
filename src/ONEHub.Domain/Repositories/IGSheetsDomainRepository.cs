using ONEHub.Domain.Params;
using ONEHub.Domain.Results;

namespace ONEHub.Domain.Repositories;

public interface IGSheetsDomainRepository
{
    Task<Result> CreateGSheetsDomainAsync(CreateGSheetsDomainParam param);
}
