using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Domains;

namespace ONEHub.Application.DomainControl.Queries;

public record GetDomainControlByIdQuery(int DomainControlId) : IRequest<DomainControlInfoDto?>;

public class GetDomainControlByIdQueryHandler(
    IMediator mediator,
    ILogger<GetDomainControlByIdQueryHandler> logger)
    : IRequestHandler<GetDomainControlByIdQuery, DomainControlInfoDto?>
{
    public async Task<DomainControlInfoDto?> Handle(
        GetDomainControlByIdQuery request,
        CancellationToken cancellationToken)
    {
        try
        {
            var results = await mediator.Send(
                new GetDomainControlQuery(string.Empty, request.DomainControlId),
                cancellationToken);
            return results.FirstOrDefault();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error fetching domain control by Id: {Id}", request.DomainControlId);
            return null;
        }
    }
}

