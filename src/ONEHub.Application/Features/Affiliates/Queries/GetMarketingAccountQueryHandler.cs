using MediatR;
using ONEHub.Application.DTOs.Affiliates;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Features.Affiliates.Queries;

public class GetMarketingAccountQueryHandler : IRequestHandler<GetMarketingAccountQuery, MarketingAccountDto>
{
    private readonly IDynamicRepository _repository;

    public GetMarketingAccountQueryHandler(IDynamicRepository repository)
    {
        _repository = repository;
    }

    public async Task<MarketingAccountDto> Handle(GetMarketingAccountQuery request, CancellationToken cancellationToken)
    {
        var result = await _repository.GetAsync<MarketingAccountDto>(
            new { AffId = request.AffiliateId });

        return result ?? new MarketingAccountDto();
    }
}

