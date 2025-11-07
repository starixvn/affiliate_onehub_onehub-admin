using MediatR;
using ONEHub.Application.Features.Shared;
using ONEHub.Domain.Params;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Features.Component.Commands;

public class DeleteBatchComponentCommand : BaseNonResultCommand
{
    public string ComponentIds { get; set; } = string.Empty;
}

public class DeleteBatchComponentHandler(
    IComponentRepository componentRepository)
    : IRequestHandler<DeleteBatchComponentCommand, Result>
{
    public async Task<Result> Handle(DeleteBatchComponentCommand request, CancellationToken cancellationToken)
    {
        var param = new DeleteBatchComponentParam
        {
            ComponentIds = request.ComponentIds,
            UserId = request.UserId,
            Ip = request.Ip,
            Host = request.Host
        };

        var result = await componentRepository.DeleteBatchComponentAsync(param);
        return result;
    }
}
