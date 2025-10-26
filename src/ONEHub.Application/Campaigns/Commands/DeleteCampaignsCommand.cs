using Fanex.Logging;
using MediatR;
using ONEHub.Domain.DTOs.Common;
using ONEHub.Domain.Interfaces;
using DeleteCommand = ONEHub.Domain.Commands.Campaigns.DeleteCampaignsCommand;

namespace ONEHub.Application.Campaigns.Commands;

public record DeleteCampaignsCommand(
    List<int> CampaignIds,
    int UserId,
    string Ip
) : IRequest<ResultInfo>;

public class DeleteCampaignsCommandHandler : IRequestHandler<DeleteCampaignsCommand, ResultInfo>
{
    private readonly IDynamicRepository _repository;
    private readonly ILogger _logger;

    public DeleteCampaignsCommandHandler(
        IDynamicRepository repository,
        ILogger logger)
    {
        _repository = repository;
        _logger = logger;
    }

    public async Task<ResultInfo> Handle(DeleteCampaignsCommand request, CancellationToken cancellationToken)
    {
        try
        {
            if (request.CampaignIds == null || request.CampaignIds.Count == 0)
            {
                return new ResultInfo
                {
                    Code = -1,
                    Message = "At least one campaign ID is required"
                };
            }

            if (request.CampaignIds.Exists(id => id <= 0))
            {
                return new ResultInfo
                {
                    Code = -1,
                    Message = "Invalid campaign ID"
                };
            }

            var command = new DeleteCommand
            {
                CampaignIds = string.Join(",", request.CampaignIds),
                UserId = request.UserId,
                Ip = request.Ip
            };

            await _repository.ExecuteAsync(command);

            if (command.ErrCode != 0)
            {
                _logger.Error($"DeleteCampaigns failed: {command.ErrMsg}");
                return new ResultInfo
                {
                    Code = command.ErrCode,
                    Message = command.ErrMsg ?? "Error deleting campaigns"
                };
            }

            return ResultInfo.Success;
        }
        catch (Exception ex)
        {
            _logger.Error($"Error deleting campaigns: {ex.Message}", ex);
            return new ResultInfo
            {
                Code = -1,
                Message = $"Error deleting campaigns: {ex.Message}"
            };
        }
    }
}
