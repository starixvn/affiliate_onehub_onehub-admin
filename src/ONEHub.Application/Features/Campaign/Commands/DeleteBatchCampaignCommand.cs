using MediatR;
using ONEHub.Application.Features.Shared;
using ONEHub.Domain.Params;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Features.Campaign.Commands;

public class DeleteBatchCampaignCommand : BaseNonResultCommand
{
    public string CampaignIds { get; set; } = string.Empty;
}

public class DeleteBatchCampaignHandler(
    ICampaignRepository campaignRepository)
    : IRequestHandler<DeleteBatchCampaignCommand, Result>
{
    public async Task<Result> Handle(DeleteBatchCampaignCommand request, CancellationToken cancellationToken)
    {
        var param = new DeleteBatchCampaignParam
        {
            CampaignIds = request.CampaignIds,
            UserId = request.UserId,
            Ip = request.Ip,
            Host = request.Host
        };

        var result = await campaignRepository.DeleteBatchCampaignAsync(param);
        return result;
    }
}
