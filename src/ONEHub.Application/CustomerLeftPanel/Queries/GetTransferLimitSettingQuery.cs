using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Customer;
using ONEHub.Domain.Criterias.Customer;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.CustomerLeftPanel.Queries;

public record GetTransferLimitSettingQuery(int AffId) : IRequest<TransferLimitSettingInfoDto?>;

public class GetTransferLimitSettingQueryHandler(
    IDynamicRepository repository,
    ILogger<GetTransferLimitSettingQueryHandler> logger)
    : IRequestHandler<GetTransferLimitSettingQuery, TransferLimitSettingInfoDto?>
{
    public async Task<TransferLimitSettingInfoDto?> Handle(
        GetTransferLimitSettingQuery request,
        CancellationToken cancellationToken)
    {
        var criteria = new TransferLimitDetailCriteria { AffId = request.AffId };
        return await repository.GetAsync<TransferLimitSettingInfoDto>(criteria);
    }
}

