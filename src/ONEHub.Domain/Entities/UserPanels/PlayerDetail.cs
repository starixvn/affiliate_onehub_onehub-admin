namespace ONEHub.Domain.Entities.UserPanels;

public class PlayerDetail
{
    public string IbcUserName { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public DateTime? RegisteredDate { get; set; }
    public decimal Deposit { get; set; }
    public decimal Withdrawal { get; set; }
    public decimal DepositFee { get; set; }
    public decimal WithdrawalFee { get; set; }
    public decimal Bonus { get; set; }
    public decimal Rebate { get; set; }
    public decimal Turnover { get; set; }
    public decimal Ggr { get; set; }
    public decimal? FirstDepositAmount { get; set; }
    public DateTime? FirstDepositDate { get; set; }
}

