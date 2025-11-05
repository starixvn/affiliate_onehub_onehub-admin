using MediatR;
using ONEHub.Application.Features.Shared;
using ONEHub.Domain.Params;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Features.Campaign.Commands;

public class UpdateBatchCampaignStatusCommand : BaseNonResultCommand
{
    public string CampaignIds { get; set; } = string.Empty;

    public int StatusId { get; set; }
}

public class UpdateBatchCampaignStatusHandler(
    ICampaignRepository campaignRepository)
    : IRequestHandler<UpdateBatchCampaignStatusCommand, Result>
{
    public async Task<Result> Handle(UpdateBatchCampaignStatusCommand request, CancellationToken cancellationToken)
    {
        var param = new UpdateBatchCampaignStatusParam
        {
            CampaignIds = request.CampaignIds,
            StatusId = request.StatusId,
            UserId = request.UserId,
            Ip = request.Ip,
            Host = request.Host
        };

        var result = await campaignRepository.UpdateBatchCampaignStatusAsync(param);
        return result;
    }
}
