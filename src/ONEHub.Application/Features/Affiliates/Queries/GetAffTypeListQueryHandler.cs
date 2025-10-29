using MediatR;
using ONEHub.Application.DTOs.Affiliates;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Features.Affiliates.Queries;

public class GetAffTypeListQueryHandler : IRequestHandler<GetAffTypeListQuery, IEnumerable<AffTypeDto>>
{
    private readonly IDynamicRepository _repository;

    public GetAffTypeListQueryHandler(IDynamicRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<AffTypeDto>> Handle(GetAffTypeListQuery request, CancellationToken cancellationToken)
    {
        var results = await _repository.FetchAsync<AffTypeDto>(new { });
        return results;
    }
}

