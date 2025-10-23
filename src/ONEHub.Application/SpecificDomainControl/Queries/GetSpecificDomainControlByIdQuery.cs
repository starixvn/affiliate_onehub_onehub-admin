using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Domains;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.SpecificDomainControl.Queries;

public record GetSpecificDomainControlByIdQuery(int Id) : IRequest<SpecificDomainControlInfoDto?>;

public class GetSpecificDomainControlByIdQueryHandler(
    IDynamicRepository repository,
    ILogger<GetSpecificDomainControlByIdQueryHandler> logger)
    : IRequestHandler<GetSpecificDomainControlByIdQuery, SpecificDomainControlInfoDto?>
{
    public async Task<SpecificDomainControlInfoDto?> Handle(
        GetSpecificDomainControlByIdQuery request,
        CancellationToken cancellationToken)
    {
        try
        {
            var results = await repository.FetchAsync<SpecificDomainControlInfoDto>(new { });
            return results.FirstOrDefault(s => s.SpecificDomainControlId == request.Id);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error fetching specific domain control by Id: {Id}", request.Id);
            return null;
        }
    }
}

