namespace ONEHub.Application.DTOs.UserPanel;

public class StatementHistoryDto
{
    public long TransId { get; set; }
    public DateTime MonthDate { get; set; }
    public int TransType { get; set; }
    public decimal Amount { get; set; }
    public string Status { get; set; } = string.Empty;
    public string Creator { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public byte? CalculatedType { get; set; }
}

