namespace ONEHub.Domain.Entities.Operations;

public class DeductionItem
{
    public int DeductionId { get; set; }
    public string DeductionName { get; set; } = string.Empty;
    public decimal DeductionPercentage { get; set; }
}

