namespace ONEHub.Application.DTOs.UserPanel;

public class DailyEarningDetailResultDto
{
    public IEnumerable<DailyEarningDetailDto> MainData { get; set; } = Array.Empty<DailyEarningDetailDto>();
    public DailyEarningDetailDto? Total { get; set; }
}

