namespace ONEHub.Application.DTOs.UserPanel;

public class DailyEarningDto
{
    public DateTime? WinlostDate { get; set; }
    public decimal Turnover { get; set; }
    public decimal Ggr { get; set; }
    public decimal Deposit { get; set; }
    public decimal Withdrawal { get; set; }
    public decimal Bonus { get; set; }
    public decimal Rebate { get; set; }
}

