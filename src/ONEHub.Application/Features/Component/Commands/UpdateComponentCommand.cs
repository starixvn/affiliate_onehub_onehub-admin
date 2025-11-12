using MediatR;
using ONEHub.Application.Features.Shared;
using ONEHub.Domain.Params;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Features.Component.Commands;

public class UpdateComponentCommand : BaseNonResultCommand
{
    public int ComponentId { get; set; }

    public int CategoryId { get; set; }

    public string ComponentName { get; set; } = string.Empty;

    public int StatusId { get; set; }

    public int? DeviceId { get; set; }
}

public class UpdateComponentHandler(
    IComponentRepository componentRepository)
    : IRequestHandler<UpdateComponentCommand, Result>
{
    public async Task<Result> Handle(UpdateComponentCommand request, CancellationToken cancellationToken)
    {
        var param = new UpdateComponentParam
        {
            ComponentId = request.ComponentId,
            CategoryId = request.CategoryId,
            ComponentName = request.ComponentName,
            StatusId = request.StatusId,
            DeviceId = request.DeviceId,
            UserId = request.UserId,
            Ip = request.Ip,
            Host = request.Host
        };

        var result = await componentRepository.UpdateComponentAsync(param);
        return result;
    }
}
