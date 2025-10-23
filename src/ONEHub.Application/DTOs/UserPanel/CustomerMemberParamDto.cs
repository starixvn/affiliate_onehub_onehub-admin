namespace ONEHub.Application.DTOs.UserPanel;

public class CustomerMemberParamDto
{
    public int AffId { get; set; }
    public byte MemberType { get; set; }
    public bool IsGetAll { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
    public int PageIndex { get; set; }
    public int PageSize { get; set; }
}

