namespace ONEHub.Application.DTOs.Operations;

public class DealSettingDetailDto : DealSettingInfoDto
{
    public IEnumerable<RevenueTierSettingDto> RevenueTierSetting { get; set; } = [];
    public IEnumerable<RevenueDeductionSettingDto> PlatformFeeSetting { get; set; } = [];
    public RevenueDeductionSettingDto? DepositFeeSetting { get; set; }
    public RevenueDeductionSettingDto? WithdrawalFeeSetting { get; set; }
    public IEnumerable<CpaTierSettingDto> CPATierSetting { get; set; } = [];
    public IEnumerable<CpaGroupProductDto> ProductGroup { get; set; } = [];
}

