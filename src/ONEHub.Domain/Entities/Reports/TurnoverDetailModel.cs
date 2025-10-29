namespace ONEHub.Domain.Entities.Reports;

public class TurnoverDetailModel
{
    public TurnoverGroupByProduct? Total { get; set; }
    public IEnumerable<TurnoverGroupByProduct> Groups { get; set; } = Array.Empty<TurnoverGroupByProduct>();
}

