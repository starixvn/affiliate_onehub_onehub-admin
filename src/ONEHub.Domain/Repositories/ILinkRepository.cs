using ONEHub.Domain.Entities;
using ONEHub.Domain.Params;
using ONEHub.Domain.Results;

namespace ONEHub.Domain.Repositories;

public interface ILinkRepository
{
    public Task<Result<LinkDashboard>> GetLinkDashboardAsync(LinkDashboardParam param);

    public Task<Result<PagingData<LinkInfo>>> GetLinkListAsync(LinkListParam param);

    public Task<Result> UpdateLinkStatusAsync(UpdateLinkParam param);
}

