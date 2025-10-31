using MediatR;
using ONEHub.Application.DTOs.LinkGenerator;
using ONEHub.Domain.Criterias.Components;
using ONEHub.Domain.DTOs.Components;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Features.LinkGenerator.Queries;

public record GetLinkGeneratorFormOptionsQuery() : IRequest<LinkGeneratorFormOptionsDto>;

public class GetLinkGeneratorFormOptionsQueryHandler(IDynamicRepository repository)
    : IRequestHandler<GetLinkGeneratorFormOptionsQuery, LinkGeneratorFormOptionsDto>
{
    public async Task<LinkGeneratorFormOptionsDto> Handle(
        GetLinkGeneratorFormOptionsQuery request,
        CancellationToken cancellationToken)
    {
        var eventsCriteria = new GetComponentListCriteria { ComponentTypeId = 1 };
        var events = await repository.FetchAsync<ComponentInfo>(eventsCriteria);

        var groupsCriteria = new GetComponentListCriteria { ComponentTypeId = 2 };
        var groups = await repository.FetchAsync<ComponentInfo>(groupsCriteria);

        var channelsCriteria = new GetComponentListCriteria { ComponentTypeId = 3 };
        var channels = await repository.FetchAsync<ComponentInfo>(channelsCriteria);

        var agenciesCriteria = new GetComponentListCriteria { ComponentTypeId = 4 };
        var agencies = await repository.FetchAsync<ComponentInfo>(agenciesCriteria);

        var typesCriteria = new GetComponentListCriteria { ComponentTypeId = 5 };
        var types = await repository.FetchAsync<ComponentInfo>(typesCriteria);

        var countriesCriteria = new GetTargetCountryCriteria { IsDefault = true };
        var countries = await repository.FetchAsync<TargetCountry>(countriesCriteria);

        return new LinkGeneratorFormOptionsDto
        {
            Events = events,
            Groups = groups,
            Channels = channels,
            Agencies = agencies,
            Types = types,
            Countries = countries
        };
    }
}

