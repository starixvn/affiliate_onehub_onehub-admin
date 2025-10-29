using Fanex.Data;
using Fanex.Data.Repository;

namespace ONEHub.Domain.Commands.LandingPages;

public abstract class BasePageBuilderCommand : NonQueryCommand
{
    public string PageName { get; set; }
    public int CampaignId { get; set; }
    public string ComponentStructure { get; set; }
    public string TargetCountryCode { get; set; }

    [SpParam(SqlParamName = "MarketId")]
    public string LanguageCode { get; set; }

    public string DealIds { get; set; }
    public int StatusId { get; set; }
    public int PageId { get; set; }
}
