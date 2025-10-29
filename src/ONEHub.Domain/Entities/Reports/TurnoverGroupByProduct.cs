namespace ONEHub.Domain.Entities.Reports;

public class TurnoverGroupByProduct
{
    public int MemberCpaId { get; set; }
    public int MemberCpaTierId { get; set; }
    public int GroupProductId { get; set; }
    public decimal Turnover { get; set; }
    public decimal CpaAmount { get; set; }
    public IEnumerable<TurnoverGroupByProductDetail> Products { get; set; } = Array.Empty<TurnoverGroupByProductDetail>();
}

