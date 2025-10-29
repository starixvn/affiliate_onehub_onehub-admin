namespace ONEHub.Application.DTOs.Reports;

public class TransferReportDto
{
    public int TransId { get; set; }
    public DateTime CreatedDate { get; set; }
    public string AffName { get; set; } = string.Empty;
    public string AffPlayerName { get; set; } = string.Empty;
    public string PlayerName { get; set; } = string.Empty;
    public string PlayerCurrency { get; set; } = string.Empty;
    public string AffPlayerCurrency { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public decimal AffPlayerAmount { get; set; }
    public decimal BasedAmount { get; set; }
    public string CreatedDateText => CreatedDate.ToString("MM/dd/yyyy HH:mm:ss");
}

