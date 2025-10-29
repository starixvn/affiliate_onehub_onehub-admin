namespace ONEHub.Domain.Entities.UserPanels;

public class DailyEarningDetailResult
{
    public IEnumerable<DailyEarningDetail> MainData { get; set; } = Array.Empty<DailyEarningDetail>();
    public DailyEarningDetail? Total { get; set; }
}

