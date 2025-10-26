using Fanex.Data.Repository;

namespace ONEHub.Domain.Commands.Campaigns;

public class InsertCampaignCommand : NonQueryCommand
{
    private const string SP_NAME = "OH_Campaign_Ins";

    public override string GetSettingKey() => SP_NAME;

    public override bool IsValid()
    {
        return StatusId >= 0 && !string.IsNullOrWhiteSpace(CampaignName);
    }

    public string CampaignName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int StatusId { get; set; }
    public int UserId { get; set; }
    public string Ip { get; set; } = string.Empty;

    public int ErrCode { get; set; }
    public string? ErrMsg { get; set; }
}
