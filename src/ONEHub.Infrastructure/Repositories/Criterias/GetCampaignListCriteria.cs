namespace ONEHub.Infrastructure.Repositories.Criterias;

public class GetCampaignListCriteria : PagingCriteria
{
    public override string GetSettingKey() => "OH_Campaign_ManageSel";

    public override bool IsValid() => true;

    public string? Search { get; set; }

    public string? StatusIds { get; set; }

    public bool IsExportExcel { get; set; }
}
