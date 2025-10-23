namespace ONEHub.Application.DTOs.Members;

public class MemberInfoDto : PlayerActionInfoDto
{
    public int MemberId { get; set; }
    public string IbcUserName { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public DateTime? RegisteredDate { get; set; }
    public int? RowNum { get; set; }
}

