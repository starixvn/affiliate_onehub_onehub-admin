using MediatR;
using ONEHub.Application.Features.Shared;
using ONEHub.Application.Services;
using ONEHub.Domain.Constants;
using ONEHub.Domain.Enums;
using ONEHub.Domain.Params;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Features.Domain.Commands;

public class RefreshDomainListCommand : BaseNonResultCommand
{
    public byte DomainType { get; set; }
}

public class RefreshDomainListCommandHandler(
    IGSheetsDataService service
) : IRequestHandler<RefreshDomainListCommand, Result>
{
    public async Task<Result> Handle(RefreshDomainListCommand request, CancellationToken cancellationToken)
    {
        var domainType = request.DomainType == 1
            ? GSheets.NormalDomainTypes
            : GSheets.ShortDomainTypes;

        foreach (var d in domainType)
        {
            var param = new GSheetsQueueParam
            {
                GSheetType = d,
                ActionType = GSheetActionType.Get,
                Priority = 100
            };

            var result = await service.PublishDataAsync(param);
            if (result.IsFailure)
            {
                return result;
            }
        }

        return Result.Success();
    }
}
