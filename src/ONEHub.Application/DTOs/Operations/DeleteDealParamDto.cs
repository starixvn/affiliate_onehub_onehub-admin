namespace ONEHub.Application.DTOs.Operations;

public class DeleteDealParamDto
{
    public int DealId { get; set; }
    public int UserId { get; set; }
    public string Ip { get; set; } = string.Empty;
}

