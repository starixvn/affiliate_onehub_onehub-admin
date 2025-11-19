using MediatR;
using ONEHub.Application.Features.Shared;
using ONEHub.Domain.Entities;
using ONEHub.Domain.Errors;
using ONEHub.Domain.Params;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Features.Campaign.Queries;

public class GetCampaignDropdownQuery : BaseQuery<IEnumerable<CampaignBase>>
{
    public int? CampaignId { get; set; }

    public string? StatusIds { get; set; }
}

public class GetCampaignDropdownQueryHandler(ICampaignRepository repository)
    : IRequestHandler<GetCampaignDropdownQuery, Result<IEnumerable<CampaignBase>>>
{
    public async Task<Result<IEnumerable<CampaignBase>>> Handle(
        GetCampaignDropdownQuery request,
        CancellationToken cancellationToken)
    {
        const string ActiveStatusId = "1";
        var param = new GetCampaignInfoParam
        {
            CampaignId = request.CampaignId,
            StatusIds = request.StatusIds ?? ActiveStatusId
        };

        var campaigns = await repository.GetCampaignInfoAsync(param);

        if (campaigns.IsFailure)
        {
            return Result<IEnumerable<CampaignBase>>.Failure(campaigns.Error);
        }

        if (campaigns.Data is null)
        {
            return Result<IEnumerable<CampaignBase>>.Failure(Error.NoData);
        }

        return Result<IEnumerable<CampaignBase>>.Success(campaigns.Data);
    }
}
