using MediatR;
using ONEHub.Application.DTOs.LinkGenerator;
using ONEHub.Domain.Criterias.LandingPages;
using ONEHub.Domain.DTOs.LandingPages;
using ONEHub.Domain.Params;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Features.LinkGenerator.Queries;

public record GetLinkGeneratorFormOptionsQuery() : IRequest<Result<LinkGeneratorFormOptionsDto>>;

public class GetLinkGeneratorFormOptionsQueryHandler(ICampaignRepository campaignRepository, IComponentRepository componentRepository, ISettingsRepository settingsRepository)
    : IRequestHandler<GetLinkGeneratorFormOptionsQuery, Result<LinkGeneratorFormOptionsDto>>
{
    public async Task<Result<LinkGeneratorFormOptionsDto>> Handle(
        GetLinkGeneratorFormOptionsQuery request,
        CancellationToken cancellationToken)
    {
        var campaigns = await campaignRepository.GetCampaignInfoAsync(new GetCampaignInfoParam { StatusIds = "1" });

        var events = await componentRepository.GetComponentAsync(new GetComponentParam { ComponentTypeId = 1 });

        var groups = await componentRepository.GetComponentAsync(new GetComponentParam { ComponentTypeId = 2 });

        var channels = await componentRepository.GetComponentAsync(new GetComponentParam { ComponentTypeId = 3 });

        var agencies = await componentRepository.GetComponentAsync(new GetComponentParam { ComponentTypeId = 4 });

        var types = await componentRepository.GetComponentAsync(new GetComponentParam { ComponentTypeId = 5 });

        var countries = await settingsRepository.GetTargetCountryListAsync();

        var landingPagesCriteria = new GetLandingPageDropdownCriteria();
        var landingPages = new List<LandingPageOption>
        {
            new() { Category = "Mobile", PageName = "Landing page mobile 1", IsComponent = true },
            new() { Category = "Mobile", PageName = "Landing page mobile 2" , IsComponent = true},
            new() { Category = "Mobile", PageName = "Landing page mobile 3", IsComponent = true},
            new() { Category = "Desktop & Mobile", PageName = "Landing page 1", IsComponent = true},
            new() { Category = "Desktop & Mobile", PageName = "Landing page 2", IsComponent = true},
            new() { Category = "Desktop & Mobile", PageName = "Landing page 3", IsComponent = true},
            new() { Category = "Desktop & Mobile", PageName = "Landing page 4", IsComponent = true},
        };

        var groupedLandingPages = landingPages
            .GroupBy(x => x.Category)
            .Select(g => new LandingPageGroup
            {
                GroupLabel = g.Key,
                Options = g.ToList()
            })
            .ToList();

        var data = new LinkGeneratorFormOptionsDto
        {
            Campaigns = campaigns.Data,
            Events = events.Data,
            Groups = groups.Data,
            Channels = channels.Data,
            Agencies = agencies.Data,
            Types = types.Data,
            Countries = countries.Data,
            LandingPages = groupedLandingPages
        };

        return Result<LinkGeneratorFormOptionsDto>.Success(data);
    }
}

