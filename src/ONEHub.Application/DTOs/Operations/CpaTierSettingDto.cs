namespace ONEHub.Application.DTOs.Operations;

public class CpaTierSettingDto
{
    public int GroupId { get; set; }
    public int GroupProductId { get; set; }
    public int TierId { get; set; }
    public decimal MinFdm { get; set; }
    public decimal MinTotalDeposit { get; set; }
    public decimal MinTO { get; set; }
    public decimal CpaAmount { get; set; }
}

