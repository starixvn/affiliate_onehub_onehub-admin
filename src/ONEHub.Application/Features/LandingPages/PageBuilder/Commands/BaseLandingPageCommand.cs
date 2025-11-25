using ONEHub.Application.Features.Shared;

namespace ONEHub.Application.Features.LandingPages.PageBuilder.Commands;

public class ModuleComponentCommand
{
    public int ModuleId { get; set; }
    public int MediaId { get; set; }
    public string ExtraInfo { get; set; } = string.Empty;
    public int OrderId { get; set; }
}

public class BaseLandingPageCommand : BaseNonResultCommand
{
    public string PageName { get; set; } = string.Empty;
    public int CampaignId { get; set; }
    public IEnumerable<ModuleComponentCommand> ModuleComponentsSetting { get; set; } = new List<ModuleComponentCommand>();
    public string TargetCountryCode { get; set; } = string.Empty;
    public string LanguageCode { get; set; } = string.Empty;
    public int StatusId { get; set; }
}
