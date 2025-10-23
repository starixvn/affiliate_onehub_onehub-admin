namespace ONEHub.Application.DTOs.UserPanel;

public class DailyEarningResultDto
{
    public IEnumerable<DailyEarningDto> MainData { get; set; } = Array.Empty<DailyEarningDto>();
    public DailyEarningDto? Total { get; set; }
}

