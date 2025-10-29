using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Domains;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Features.SubAffDomain.Queries;

public record GetSubAffDomainListQuery : IRequest<IEnumerable<DomainInfoDto>>;

public class GetSubAffDomainListQueryHandler(
    IDynamicRepository repository,
    ILogger<GetSubAffDomainListQueryHandler> logger)
    : IRequestHandler<GetSubAffDomainListQuery, IEnumerable<DomainInfoDto>>
{
    public async Task<IEnumerable<DomainInfoDto>> Handle(
        GetSubAffDomainListQuery request,
        CancellationToken cancellationToken)
    {
        return await repository.FetchAsync<DomainInfoDto>(new { });
    }
}

