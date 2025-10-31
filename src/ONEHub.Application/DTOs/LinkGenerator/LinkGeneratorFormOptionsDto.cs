using ONEHub.Domain.DTOs.Components;

namespace ONEHub.Application.DTOs.LinkGenerator;

public class LinkGeneratorFormOptionsDto
{
    public IEnumerable<ComponentInfo> Events { get; set; } = [];
    public IEnumerable<ComponentInfo> Groups { get; set; } = [];
    public IEnumerable<ComponentInfo> Channels { get; set; } = [];
    public IEnumerable<ComponentInfo> Agencies { get; set; } = [];
    public IEnumerable<ComponentInfo> Types { get; set; } = [];
    public IEnumerable<TargetCountry> Countries { get; set; } = [];
}

