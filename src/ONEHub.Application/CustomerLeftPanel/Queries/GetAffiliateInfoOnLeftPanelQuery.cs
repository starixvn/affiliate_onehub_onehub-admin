using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Customer;
using ONEHub.Domain.Criterias.Customer;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.CustomerLeftPanel.Queries;

public record GetAffiliateInfoOnLeftPanelQuery(string Username) : IRequest<AffiliateInfoOnLeftPanelDto?>;

public class GetAffiliateInfoOnLeftPanelQueryHandler(
    IDynamicRepository repository,
    ILogger<GetAffiliateInfoOnLeftPanelQueryHandler> logger)
    : IRequestHandler<GetAffiliateInfoOnLeftPanelQuery, AffiliateInfoOnLeftPanelDto?>
{
    public async Task<AffiliateInfoOnLeftPanelDto?> Handle(
        GetAffiliateInfoOnLeftPanelQuery request,
        CancellationToken cancellationToken)
    {
        var criteria = new AffiliateInfoOnLeftPanelCriteria { Username = request.Username };
        return await repository.GetAsync<AffiliateInfoOnLeftPanelDto>(criteria);
    }
}

