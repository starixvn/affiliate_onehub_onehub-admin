using MediatR;
using ONEHub.Application.Features.Shared;
using ONEHub.Domain.Params;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Features.Campaign.Commands;

public class CreateCampaignCommand : BaseCommand<CampaignCreatedResponse>
{
    public string CampaignName { get; set; } = string.Empty;

    public string? Description { get; set; }

    public int StatusId { get; set; }
}

public record CampaignCreatedResponse(int CampaignId, string CampaignCode);

public class CreateCampaignHandler(
    ICampaignRepository campaignRepository)
    : IRequestHandler<CreateCampaignCommand, Result<CampaignCreatedResponse>>
{
    public async Task<Result<CampaignCreatedResponse>> Handle(CreateCampaignCommand request, CancellationToken cancellationToken)
    {
        var param = new CreateCampaignParam
        {
            CampaignName = request.CampaignName,
            Description = request.Description,
            StatusId = request.StatusId,
            UserId = request.UserId,
            Host = request.Host,
            Ip = request.Ip,
        };

        var createResult = await campaignRepository.CreateCampaignAsync(param);

        if (createResult.IsFailure || createResult.Data is null)
        {
            return Result<CampaignCreatedResponse>.Failure(createResult.Error);
        }

        return Result<CampaignCreatedResponse>.Success(new CampaignCreatedResponse(createResult.Data.CampaignId, createResult.Data.CampaignCode));
    }
}
