using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Domains;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.CommonDomain.Queries;

public record GetDomainListQuery(string SpKey) : IRequest<IEnumerable<DomainInfoDto>>;

public class GetDomainListQueryHandler(
    IDynamicRepository repository,
    ILogger<GetDomainListQueryHandler> logger)
    : IRequestHandler<GetDomainListQuery, IEnumerable<DomainInfoDto>>
{
    public async Task<IEnumerable<DomainInfoDto>> Handle(
        GetDomainListQuery request,
        CancellationToken cancellationToken)
    {
        var results = await repository.FetchAsync<DomainInfoDto>(new { SpKey = request.SpKey });
        return results.ToList();
    }
}

