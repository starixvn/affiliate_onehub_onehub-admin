using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.LandingPages;
using ONEHub.Domain.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Features.LandingPages.PageBuilder.Commands;

public record ValidatePageBuilderParamCommand(InsertUpdatePageBuilderParamDto Param) : IRequest<ResultInfo>;

public class ValidatePageBuilderParamCommandHandler(
    IDynamicRepository repository,
    ILogger<ValidatePageBuilderParamCommandHandler> logger)
    : IRequestHandler<ValidatePageBuilderParamCommand, ResultInfo>
{
    public async Task<ResultInfo> Handle(
        ValidatePageBuilderParamCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            var result = await repository.GetAsync<dynamic>(request.Param);

            if (result == null)
            {
                return ResultInfo.Success;
            }

            return ResultInfo.GenerateError("Validation failed");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error validating page builder param: {@Param}", request.Param);
            return ResultInfo.GenerateError("Error validating page builder param");
        }
    }
}

