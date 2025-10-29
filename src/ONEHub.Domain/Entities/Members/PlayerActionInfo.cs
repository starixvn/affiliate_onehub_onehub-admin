namespace ONEHub.Domain.Entities.Members;

public class PlayerActionInfo
{
    public string PlayerUsername { get; set; } = string.Empty;
    public DateTime? LastLoginDate { get; set; }
    public DateTime? LastDepositDate { get; set; }
    public DateTime? LastWithdrawalDate { get; set; }
    public decimal? LastDepositAmount { get; set; }
    public decimal? LastWithdrawalAmount { get; set; }
}

