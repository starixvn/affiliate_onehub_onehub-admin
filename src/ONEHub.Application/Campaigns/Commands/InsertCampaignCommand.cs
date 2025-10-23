using Fanex.Logging;
using MediatR;
using ONEHub.Domain.DTOs.Common;
using ONEHub.Domain.Interfaces;
using InsertCommand = ONEHub.Domain.Commands.Campaigns.InsertCampaignCommand;

namespace ONEHub.Application.Campaigns.Commands;

public record InsertCampaignCommand(
    string CampaignName,
    string? Description,
    int StatusId,
    int UserId,
    string Ip
) : IRequest<ResultInfo>;

public class InsertCampaignCommandHandler : IRequestHandler<InsertCampaignCommand, ResultInfo>
{
    private readonly IDynamicRepository _repository;
    private readonly ILogger _logger;

    public InsertCampaignCommandHandler(
        IDynamicRepository repository,
        ILogger logger)
    {
        _repository = repository;
        _logger = logger;
    }

    public async Task<ResultInfo> Handle(InsertCampaignCommand request, CancellationToken cancellationToken)
    {
        try
        {
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

            var command = new InsertCommand
            {
                CampaignName = request.CampaignName.Trim(),
                Description = request.Description?.Trim(),
                StatusId = request.StatusId,
                UserId = request.UserId,
                Ip = request.Ip
            };

            await _repository.ExecuteAsync(command);

            if (command.ErrCode != 0)
            {
                _logger.Error($"InsertCampaign failed: {command.ErrMsg}");
                return new ResultInfo
                {
                    Code = command.ErrCode,
                    Message = command.ErrMsg ?? "Error creating campaign"
                };
            }

            return ResultInfo.Success;
        }
        catch (Exception ex)
        {
            _logger.Error($"Error creating campaign: {ex.Message}", ex);
            return new ResultInfo
            {
                Code = -1,
                Message = $"Error creating campaign: {ex.Message}"
            };
        }
    }
}
