namespace ONEHub.Application.DTOs.Operations;

public class DealSettingParamDto : DealSettingDetailDto
{
    public bool CheckedMinFdm { get; set; }
    public bool CheckedMinTotalDeposit { get; set; }
    public bool CheckedMinTurnover { get; set; }
    public bool IsActivePlayerHoldingPeriod { get; set; }
    public bool IsQuota { get; set; }
    public bool IsRedeposit { get; set; }
    public int UserId { get; set; }
    public string Ip { get; set; } = string.Empty;
}

