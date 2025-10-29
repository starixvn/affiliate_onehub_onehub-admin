using Fanex.Logging;
using MediatR;
using ONEHub.Domain.DTOs.Common;
using ONEHub.Domain.Interfaces;
using UpdateCommand = ONEHub.Domain.Commands.Campaigns.UpdateCampaignCommand;

namespace ONEHub.Application.Features.Campaigns.Commands;

public record UpdateCampaignCommand(
    int CampaignId,
    string CampaignName,
    string? Description,
    int StatusId,
    int UserId,
    string Ip
) : IRequest<ResultInfo>;

public class UpdateCampaignCommandHandler : IRequestHandler<UpdateCampaignCommand, ResultInfo>
{
    private readonly IDynamicRepository _repository;
    private readonly ILogger _logger;

    public UpdateCampaignCommandHandler(
        IDynamicRepository repository,
        ILogger logger)
    {
        _repository = repository;
        _logger = logger;
    }

    public async Task<ResultInfo> Handle(UpdateCampaignCommand request, CancellationToken cancellationToken)
    {
        try
        {
            if (request.CampaignId <= 0)
            {
                return new ResultInfo
                {
                    Code = -1,
                    Message = "Invalid Campaign ID"
                };
            }

            if (string.IsNullOrWhiteSpace(request.CampaignName))
            {
                return new ResultInfo
                {
                    Code = -1,
                    Message = "Campaign Name is required"
                };
            }

            if (request.StatusId < 0)
            {
                return new ResultInfo
                {
                    Code = -1,
                    Message = "Invalid Status ID"
                };
            }

            var command = new UpdateCommand
            {
                CampaignId = request.CampaignId,
                CampaignName = request.CampaignName.Trim(),
                Description = request.Description?.Trim(),
                StatusId = request.StatusId,
                UserId = request.UserId,
                Ip = request.Ip
            };

            await _repository.ExecuteAsync(command);

            if (command.ErrCode != 0)
            {
                _logger.Error($"UpdateCampaign failed: {command.ErrMsg}");
                return new ResultInfo
                {
                    Code = command.ErrCode,
                    Message = command.ErrMsg ?? "Error updating campaign"
                };
            }

            return ResultInfo.Success;
        }
        catch (Exception ex)
        {
            _logger.Error($"Error updating campaign: {ex.Message}", ex);
            return new ResultInfo
            {
                Code = -1,
                Message = $"Error updating campaign: {ex.Message}"
            };
        }
    }
}
