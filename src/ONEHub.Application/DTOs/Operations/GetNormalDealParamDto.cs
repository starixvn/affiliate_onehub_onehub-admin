namespace ONEHub.Application.DTOs.Operations;

public class GetNormalDealParamDto
{
    public int? AffId { get; set; }
    public int? GroupId { get; set; }
    public bool IsOnlyRevenue { get; set; }
}

