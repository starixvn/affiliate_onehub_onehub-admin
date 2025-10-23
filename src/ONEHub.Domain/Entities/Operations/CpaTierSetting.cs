namespace ONEHub.Domain.Entities.Operations;

public class CpaTierSetting
{
    public int GroupId { get; set; }
    public int GroupProductId { get; set; }
    public int TierId { get; set; }
    public decimal MinimumFirstDeposit { get; set; }
    public decimal MinimumTotalDeposit { get; set; }
    public decimal MinimumTurnover { get; set; }
    public decimal CpaAmount { get; set; }
}

