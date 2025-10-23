using MediatR;
using ONEHub.Domain.Criterias.Campaigns;
using ONEHub.Domain.DTOs.Campaigns;
using ONEHub.Domain.DTOs.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Campaigns.Queries;

public record GetCampaignListQuery(
    string? Search,
    string? StatusIds,
    string? Description,
    int PageIndex,
    int PageSize,
    bool IsExportExcel
) : IRequest<EntityResult<CampaignDetailInfo>>;

public class GetCampaignListQueryHandler : IRequestHandler<GetCampaignListQuery, EntityResult<CampaignDetailInfo>>
{
    private readonly IDynamicRepository _repository;

    public GetCampaignListQueryHandler(IDynamicRepository repository)
    {
        _repository = repository;
    }

    public async Task<EntityResult<CampaignDetailInfo>> Handle(GetCampaignListQuery request, CancellationToken cancellationToken)
    {
        var criteria = new GetCampaignListCriteria
        {
            Search = request.Search?.Trim(),
            StatusIds = request.StatusIds,
            Description = request.Description?.Trim(),
            PageIndex = request.PageIndex,
            PageSize = request.PageSize,
            IsExportExcel = request.IsExportExcel
        };

        var result = await _repository.FetchAsync<CampaignDetailInfo>(criteria);
        return new EntityResult<CampaignDetailInfo>
        {
            MainData = result.ToList(),
            TotalItem = criteria.TotalItem
        };
    }
}
