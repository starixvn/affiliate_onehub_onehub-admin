using MediatR;
using ONEHub.Application.DTOs.LinkGenerator;
using ONEHub.Domain.Criterias.Campaigns;
using ONEHub.Domain.Criterias.Components;
using ONEHub.Domain.Criterias.LandingPages;
using ONEHub.Domain.DTOs.Campaigns;
using ONEHub.Domain.DTOs.Components;
using ONEHub.Domain.DTOs.LandingPages;
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
        var campaignsCriteria = new GetCampaignDropdownCriteria { StatusIds = "1" };
        var campaigns = await repository.FetchAsync<CampaignInfo>(campaignsCriteria);

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

        var landingPagesCriteria = new GetLandingPageDropdownCriteria();
        var landingPages = await repository.FetchAsync<LandingPageOption>(landingPagesCriteria);

        var groupedLandingPages = landingPages
            .GroupBy(x => x.Category)
            .Select(g => new LandingPageGroup
            {
                GroupLabel = g.Key,
                Options = g.ToList()
            })
            .ToList();

        return new LinkGeneratorFormOptionsDto
        {
            Campaigns = campaigns,
            Events = events,
            Groups = groups,
            Channels = channels,
            Agencies = agencies,
            Types = types,
            Countries = countries,
            LandingPages = groupedLandingPages
        };
    }
}

