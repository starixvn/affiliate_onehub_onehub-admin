using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.EmailHistory;
using ONEHub.Domain.Interfaces;
using ONEHub.Domain.ValueObjects;

namespace ONEHub.Application.EmailHistory.Commands;

public record DeleteEmailHistoryCommand(DeleteEmailHistoryParamDto Param) : IRequest<ResultInfo>;

public class DeleteEmailHistoryCommandHandler(
    IDynamicRepository repository,
    ILogger<DeleteEmailHistoryCommandHandler> logger)
    : IRequestHandler<DeleteEmailHistoryCommand, ResultInfo>
{
    public async Task<ResultInfo> Handle(
        DeleteEmailHistoryCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            var param = new
            {
                request.Param.UserId,
                request.Param.Ip,
                EmailIdList = request.Param.EmailIdList
            };

            var result = await repository.ExecuteAsync(param);
            return result > 0
                ? ResultInfo.GenerateSuccess("Email history deleted successfully.")
                : ResultInfo.GenerateErr("Failed to delete email history.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error deleting email history");
            return ResultInfo.GenerateErr($"Error deleting email history: {ex.Message}");
        }
    }
}

