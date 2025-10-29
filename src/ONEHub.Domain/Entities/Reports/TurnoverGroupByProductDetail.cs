namespace ONEHub.Domain.Entities.Reports;

public class TurnoverGroupByProductDetail : TurnoverGroupByProduct
{
    public string ProductName { get; set; } = string.Empty;
    public int ProductId { get; set; }
}

