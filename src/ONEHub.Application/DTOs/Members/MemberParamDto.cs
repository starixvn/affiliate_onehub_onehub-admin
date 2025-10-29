namespace ONEHub.Application.DTOs.Members;

public class MemberParamDto
{
    public string? AffName { get; set; }
    public string? UserName { get; set; }
    public string? IbcUserName { get; set; }
    public bool IsIncludeRemovedPlayer { get; set; }
    public int PageIndex { get; set; }
    public int PageSize { get; set; }
}

