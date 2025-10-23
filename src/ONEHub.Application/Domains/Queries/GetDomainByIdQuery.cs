using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Domains;

namespace ONEHub.Application.Domains.Queries;

public record GetDomainByIdQuery(int DomainId, bool IsAffDomain = true) : IRequest<DomainInfoDto?>;

public class GetDomainByIdQueryHandler(
    IMediator mediator,
    ILogger<GetDomainByIdQueryHandler> logger)
    : IRequestHandler<GetDomainByIdQuery, DomainInfoDto?>
{
    public async Task<DomainInfoDto?> Handle(
        GetDomainByIdQuery request,
        CancellationToken cancellationToken)
    {
        try
        {
            var domains = await mediator.Send(new GetDomainListQuery(request.IsAffDomain), cancellationToken);
            return domains.FirstOrDefault(d => d.DomainId == request.DomainId);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error fetching domain by ID: {DomainId}, IsAffDomain: {IsAffDomain}",
                request.DomainId, request.IsAffDomain);
            return null;
        }
    }
}

