using ONEHub.Application.Features.Campaign.Queries;
using ONEHub.Domain.Entities;

namespace ONEHub.Application.DTOs.LinkGenerator;

public class LinkGeneratorFormOptionsDto
{
    public IEnumerable<CampaignBase> Campaigns { get; set; } = [];
    public IEnumerable<Component> Events { get; set; } = [];
    public IEnumerable<Component> Groups { get; set; } = [];
    public IEnumerable<Component> Channels { get; set; } = [];
    public IEnumerable<Component> Agencies { get; set; } = [];
    public IEnumerable<Component> Types { get; set; } = [];
    public IEnumerable<TargetCountry> Countries { get; set; } = [];
    public IEnumerable<LandingPageGroup> LandingPages { get; set; } = [];
}

