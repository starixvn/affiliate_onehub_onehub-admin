namespace ONEHub.Infrastructure.Repositories.Commands.LandingPages;

public abstract class BaseLandingPageCommand : BaseCommand
{
    public string? PageName { get; set; }
    public int CampaignId { get; set; }
    public string? ComponentStructure { get; set; }
    public string? TargetCountryCode { get; set; }
    public string? LanguageCode { get; set; }
    public int StatusId { get; set; }
    public int PageId { get; set; }
}
