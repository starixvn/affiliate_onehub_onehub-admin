namespace ONEHub.Domain.Entities.UserPanels;

public class DailyEarning
{
    public DateTime? WinLossDate { get; set; }
    public decimal Turnover { get; set; }
    public decimal GrossGamingRevenue { get; set; }
    public decimal Deposit { get; set; }
    public decimal Withdrawal { get; set; }
    public decimal Bonus { get; set; }
    public decimal Rebate { get; set; }
}

