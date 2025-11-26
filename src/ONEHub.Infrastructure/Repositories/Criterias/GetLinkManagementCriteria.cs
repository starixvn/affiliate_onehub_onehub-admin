namespace ONEHub.Infrastructure.Repositories.Criterias;

public class GetLinkManagementCriteria : PagingCriteria
{
    public override string GetSettingKey() => "OH_LinkManagement_ManageSel";

    public override bool IsValid() => true;

    public string? Search { get; set; }

    public string? StatusIds { get; set; }

    public string? CountryCodes { get; set; }

    public string? ChannelIds { get; set; }

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    public bool IsExportExcel { get; set; }
}

