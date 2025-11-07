using MediatR;
using ONEHub.Application.Features.Shared;
using ONEHub.Domain.Params;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Features.Component.Commands;

public class UpdateBatchComponentStatusCommand : BaseNonResultCommand
{
    public string ComponentIds { get; set; } = string.Empty;

    public int StatusId { get; set; }
}

public class UpdateBatchComponentStatusHandler(
    IComponentRepository componentRepository)
    : IRequestHandler<UpdateBatchComponentStatusCommand, Result>
{
    public async Task<Result> Handle(UpdateBatchComponentStatusCommand request, CancellationToken cancellationToken)
    {
        var param = new UpdateBatchComponentStatusParam
        {
            ComponentIds = request.ComponentIds,
            StatusId = request.StatusId,
            UserId = request.UserId,
            Ip = request.Ip,
            Host = request.Host
        };

        var result = await componentRepository.UpdateBatchComponentStatusAsync(param);
        return result;
    }
}
