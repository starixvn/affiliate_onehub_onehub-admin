using MediatR;
using ONEHub.Domain.Criterias.Campaigns;
using ONEHub.Domain.DTOs.Campaigns;
using ONEHub.Domain.DTOs.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Features.Campaigns.Queries;

public record GetCampaignListQuery(
    string? Search,
    string? StatusIds,
    int PageIndex,
    int PageSize,
    bool IsExportExcel
) : IRequest<EntityResult<CampaignDetailInfo>>;

public class GetCampaignListQueryHandler(IDynamicRepository repository)
    : IRequestHandler<GetCampaignListQuery, EntityResult<CampaignDetailInfo>>
{
    public async Task<EntityResult<CampaignDetailInfo>> Handle(GetCampaignListQuery request, CancellationToken cancellationToken)
    {
        var criteria = new GetCampaignListCriteria
        {
            Search = request.Search?.Trim(),
            StatusIds = request.StatusIds,
            PageIndex = request.PageIndex,
            PageSize = request.PageSize,
            IsExportExcel = request.IsExportExcel
        };

        var result = await repository.FetchAsync<CampaignDetailInfo>(criteria);
        return new EntityResult<CampaignDetailInfo>
        {
            MainData = result.ToList(),
            TotalItem = criteria.TotalItem
        };
    }
}
