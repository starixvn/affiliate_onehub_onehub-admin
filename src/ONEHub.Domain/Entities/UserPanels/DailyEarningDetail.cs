namespace ONEHub.Domain.Entities.UserPanels;

public class DailyEarningDetail
{
    public int CustomerId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string IbcUserName { get; set; } = string.Empty;
    public decimal Turnover { get; set; }
    public decimal Ggr { get; set; }
    public decimal Deposit { get; set; }
    public decimal Withdrawal { get; set; }
    public decimal Bonus { get; set; }
    public decimal Rebate { get; set; }
}

