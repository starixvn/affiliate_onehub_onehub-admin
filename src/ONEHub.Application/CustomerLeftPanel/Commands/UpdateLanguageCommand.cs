using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Customer;
using ONEHub.Domain.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.CustomerLeftPanel.Commands;

public record UpdateLanguageCommand(UpdateLanguageParamDto Param) : IRequest<ResultInfo>;

public class UpdateLanguageCommandHandler(
    IDynamicRepository repository,
    ILogger<UpdateLanguageCommandHandler> logger)
    : IRequestHandler<UpdateLanguageCommand, ResultInfo>
{
    public async Task<ResultInfo> Handle(
        UpdateLanguageCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            var rowsAffected = await repository.ExecuteAsync(request.Param);

            return rowsAffected > 0
                ? ResultInfo.Success
                : ResultInfo.GenerateError("Update language failed");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error updating language: {@Param}", request.Param);
            return ResultInfo.GenerateError("Error updating language");
        }
    }
}

