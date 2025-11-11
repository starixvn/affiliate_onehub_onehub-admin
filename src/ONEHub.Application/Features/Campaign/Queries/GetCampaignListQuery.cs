using MediatR;
using ONEHub.Application.Features.Shared;
using ONEHub.Application.Utils;
using ONEHub.Domain.Entities;
using ONEHub.Domain.Errors;
using ONEHub.Domain.Params;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Features.Campaign.Queries;

public class GetCampaignListQuery : PagingQuery<CampaignResponse>
{
    public string? Search { get; set; } 

    public string? StatusIds { get; set; } 

    public bool IsExportExcel { get; set; }
}

public record CampaignResponse(
    int CampaignId,
    string CampaignCode,
    string CampaignName,
    string Description,
    string Creator,
    string CreatedDate,
    string UpdatedBy,
    string UpdatedDate,
    int StatusId,
    string Status,
    int RowIdx);

public class GetCampaignListHandler(ICampaignRepository campaignRepository)
    : IRequestHandler<GetCampaignListQuery, Result<PagingData<CampaignResponse>>>
{
    public async Task<Result<PagingData<CampaignResponse>>> Handle(GetCampaignListQuery request, CancellationToken cancellationToken)
    {
        var param = new CampaignListParam
        {
            Search = request.Search,
            StatusIds = request.StatusIds,
            PageIndex = request.PageIndex,
            PageSize = request.PageSize,
            IsExportExcel = request.IsExportExcel
        };

        var campaignListResult = await campaignRepository.GetCampaignListAsync(param);

        if (campaignListResult.IsFailure)
        {
            return Result<PagingData<CampaignResponse>>.Failure(campaignListResult.Error);
        }

        if (campaignListResult.Data is null)
        {
            return Result<PagingData<CampaignResponse>>.Failure(Error.NoData);
        }

        var result = new PagingData<CampaignResponse>
        {
            Items = campaignListResult.Data.Items.Select(campaign => new CampaignResponse(
                campaign.CampaignId,
                campaign.CampaignCode,
                campaign.CampaignName,
                campaign.Description,
                campaign.Creator,
                DateTimeUtils.FormatDateString(campaign.CreatedDate),
                campaign.UpdatedBy,
                DateTimeUtils.FormatDateString(campaign.UpdatedDate),
                campaign.StatusId,
                campaign.Status,
                campaign.RowIdx
            )).ToList(),
            TotalItem = campaignListResult.Data.TotalItem,
            PageIndex = request.PageIndex,
            PageSize = request.PageSize
        };

        return Result<PagingData<CampaignResponse>>.Success(result);
    }
}
