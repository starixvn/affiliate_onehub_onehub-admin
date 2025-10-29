namespace ONEHub.Application.DTOs.Reports;

public class AffiliateReportDto
{
    public int AffId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string PaymentCurrency { get; set; } = string.Empty;
    public DateTime? MonthDate { get; set; }
    public string Description { get; set; } = string.Empty;
    public string MonthDateString => MonthDate?.ToString("MM/yyyy") ?? string.Empty;
    public int TotalClick { get; set; }
    public int UniqueClick { get; set; }
    public int Signup { get; set; }
    public int Fdm { get; set; }
    public decimal Fdm_Amount { get; set; }
    public decimal FDM_TotalDeposit { get; set; }
    public int ActivePlayer { get; set; }
    public int QualifiedMember { get; set; }
    public decimal Deposit { get; set; }
    public decimal Withdrawal { get; set; }
    public decimal Turnover { get; set; }
    public decimal Ggr { get; set; }
    public decimal Bonus { get; set; }
    public decimal Rebate { get; set; }
    public decimal PlatformFee { get; set; }
    public decimal DepositFee { get; set; }
    public decimal WithdrawalFee { get; set; }
    public decimal TotalFee { get; set; }
    public decimal CommissionRate { get; set; }
    public decimal Earning { get; set; }
    public string EarningBy { get; set; } = string.Empty;
    public decimal AffWithdrawal { get; set; }
    public decimal AffAdjustment { get; set; }
    public decimal BalanceBf { get; set; }
    public decimal CurrentBBF { get; set; }
    public int NoOfSubAff { get; set; }
    public decimal SubAffEarning { get; set; }
    public decimal TotalEarning => Earning + SubAffEarning;
    public bool IsMultiGroupProduct { get; set; }
    public int TotalDeposit { get; set; }
    public string PreferredLanguage { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string CommGroupName { get; set; } = string.Empty;
}

