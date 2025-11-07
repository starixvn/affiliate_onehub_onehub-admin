using ONEHub.Application.Features.Campaign.Queries;
using ONEHub.Domain.Entities;

namespace ONEHub.Application.DTOs.LinkGenerator;

public class LinkGeneratorFormOptionsDto
{
    public IEnumerable<CampaignBase> Campaigns { get; set; } = [];
    public IEnumerable<ComponentInfo> Events { get; set; } = [];
    public IEnumerable<ComponentInfo> Groups { get; set; } = [];
    public IEnumerable<ComponentInfo> Channels { get; set; } = [];
    public IEnumerable<ComponentInfo> Agencies { get; set; } = [];
    public IEnumerable<ComponentInfo> Types { get; set; } = [];
    public IEnumerable<TargetCountry> Countries { get; set; } = [];
    public IEnumerable<LandingPageGroup> LandingPages { get; set; } = [];
}

