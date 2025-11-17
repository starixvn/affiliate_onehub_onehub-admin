using Fanex.Data.Repository;

namespace ONEHub.Infrastructure.Repositories.Criterias;

public class GetLinkDashboardCriteria : CriteriaBase
{
    public override string GetSettingKey() => "OH_LinkManagement_Dashboard_Sel";

    public override bool IsValid() => true;

    public string? Search { get; set; }

    public string? CountryCodes { get; set; }

    public string? ChannelIds { get; set; }

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }
}

