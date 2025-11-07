using MediatR;
using ONEHub.Application.Features.Shared;
using ONEHub.Domain.Params;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Features.Component.Commands;

public class CreateComponentCommand : BaseNonResultCommand
{
    public int CategoryId { get; set; }

    public string ComponentName { get; set; } = string.Empty;

    public string ComponentCode { get; set; } = string.Empty;

    public int StatusId { get; set; }

    public int? DeviceId { get; set; }
}

public class CreateCampaignHandler(
    IComponentRepository componentRepository)
    : IRequestHandler<CreateComponentCommand, Result>
{
    public async Task<Result> Handle(CreateComponentCommand request, CancellationToken cancellationToken)
    {
        var param = new CreateComponentParam
        {
            CategoryId = request.CategoryId,
            ComponentName = request.ComponentName,
            ComponentCode = request.ComponentCode,
            StatusId = request.StatusId,
            DeviceId = request.DeviceId,
            UserId = request.UserId,
            Host = request.Host,
            Ip = request.Ip,
        };

        var createResult = await componentRepository.CreateComponentAsync(param);

        return createResult;
    }
}
