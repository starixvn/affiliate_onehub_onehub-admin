namespace ONEHub.Domain.Entities.UserPanels;

public class StatementHistory
{
    public int StatementId { get; set; }
    public DateTime StatementDate { get; set; }
    public string StatementMonth { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Status { get; set; } = string.Empty;
    public string Currency { get; set; } = string.Empty;
}

