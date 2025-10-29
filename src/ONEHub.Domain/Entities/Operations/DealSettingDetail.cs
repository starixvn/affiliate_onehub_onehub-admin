namespace ONEHub.Domain.Entities.Operations;

public class DealSettingDetail : DealSettingInfo
{
    public IEnumerable<RevenueTierSetting> RevenueTierSetting { get; set; } = Array.Empty<RevenueTierSetting>();
    public IEnumerable<RevenueDeductionSetting> PlatformFeeSetting { get; set; } = Array.Empty<RevenueDeductionSetting>();
    public RevenueDeductionSetting? DepositFeeSetting { get; set; }
    public RevenueDeductionSetting? WithdrawalFeeSetting { get; set; }
    public IEnumerable<CpaTierSetting> CpaTierSetting { get; set; } = Array.Empty<CpaTierSetting>();
    public IEnumerable<CpaGroupProduct> ProductGroup { get; set; } = Array.Empty<CpaGroupProduct>();
}

