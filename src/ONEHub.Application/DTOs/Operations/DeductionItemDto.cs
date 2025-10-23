namespace ONEHub.Application.DTOs.Operations;

public class DeductionItemDto
{
    public int DeductionId { get; set; }
    public string DeductionName { get; set; } = string.Empty;
    public decimal DeductedPercentage { get; set; }
    public bool IsDeductedPercent { get; set; }
    public string DeductedAmount { get; set; } = string.Empty;
    public decimal Commission { get; set; }
    public int GroupProductId { get; set; }
}

