namespace ONEHub.Application.DTOs.Operations;

public class DealParamDto
{
    public int? GroupId { get; set; }
    public string? GroupName { get; set; }
    public int? GroupTypeId { get; set; }
    public int PageIndex { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}

