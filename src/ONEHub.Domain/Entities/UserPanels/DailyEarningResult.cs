namespace ONEHub.Domain.Entities.UserPanels;

public class DailyEarningResult
{
    public IEnumerable<DailyEarning> MainData { get; set; } = Array.Empty<DailyEarning>();
    public DailyEarning? Total { get; set; }
}

