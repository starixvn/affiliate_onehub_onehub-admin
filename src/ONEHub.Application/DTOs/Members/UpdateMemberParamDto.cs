namespace ONEHub.Application.DTOs.Members;

public class UpdateMemberParamDto
{
    public int UserId { get; set; }
    public string Ip { get; set; } = string.Empty;
    public int MemberId { get; set; }
    public DateTime FromDate { get; set; }
}

