using MediatR;
using ONEHub.Application.Features.Shared;
using ONEHub.Domain.Params;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Features.Campaign.Commands;


public class UpdateCampaignCommand : BaseNonResultCommand
{
    public int CampaignId { get; set; }
    public string CampaignName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int StatusId { get; set; }
}

public class UpdateCampaignHandler(
    ICampaignRepository campaignRepository)
    : IRequestHandler<UpdateCampaignCommand, Result>
{
    public async Task<Result> Handle(UpdateCampaignCommand request, CancellationToken cancellationToken)
    {
        var param = new UpdateCampaignParam
        {
            CampaignId = request.CampaignId,
            CampaignName = request.CampaignName,
            Description = request.Description,
            StatusId = request.StatusId,
            UserId = request.UserId,
            Ip = request.Ip,
            Host = request.Host
        };

        var result = await campaignRepository.UpdateCampaignAsync(param);
        return result;
    }
}
