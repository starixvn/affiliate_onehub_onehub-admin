using MediatR;
using ONEHub.Application.DTOs.Affiliates;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Features.Affiliates.Queries;

public class GetAffiliateBasicInfoQueryHandler : IRequestHandler<GetAffiliateBasicInfoQuery, AffiliateBasicInfoDto?>
{
    private readonly IDynamicRepository _repository;

    public GetAffiliateBasicInfoQueryHandler(IDynamicRepository repository)
    {
        _repository = repository;
    }

    public async Task<AffiliateBasicInfoDto?> Handle(GetAffiliateBasicInfoQuery request, CancellationToken cancellationToken)
    {
        var criteria = new
        {
            AffId = request.AffiliateId,
            AffName = request.AffiliateName
        };

        var result = await _repository.GetAsync<AffiliateBasicInfoDto>(criteria);

        return result;
    }
}

