using ONEHub.Domain.Entities;
using ONEHub.Domain.Params;
using ONEHub.Domain.Results;

namespace ONEHub.Domain.Repositories;

public interface ILinkRepository
{
    public Task<Result<LinkManagement>> GetLinkManagementDataAsync(LinkManagementParam param);

    public Task<Result> UpdateLinkStatusAsync(UpdateLinkParam param);
}

