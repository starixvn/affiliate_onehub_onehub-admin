using MediatR;
using ONEHub.Application.Features.Shared;
using ONEHub.Domain.Params;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Features.Components.Commands;

public class CreateComponentCommand : BaseNonResultCommand
{
    public string ComponentName { get; set; } = string.Empty;

    public string ComponentCode { get; set; } = string.Empty;

    public int ComponentTypeId { get; set; }

    public int StatusId { get; set; }
}

public class CreateComponentHandler(
    IComponentRepository componentRepository)
    : IRequestHandler<CreateComponentCommand, Result>
{
    public async Task<Result> Handle(CreateComponentCommand request, CancellationToken cancellationToken)
    {
        var param = new CreateComponentParam
        {
            ComponentName = request.ComponentName,
            ComponentCode = request.ComponentCode,
            ComponentTypeId = request.ComponentTypeId,
            StatusId = request.StatusId,
            UserId = request.UserId,
            Host = request.Host,
            Ip = request.Ip,
        };

        var createResult = await componentRepository.CreateComponentAsync(param);

        return createResult;
    }
}
