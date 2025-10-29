namespace ONEHub.Domain.Entities.Members;

public class MemberInfo : PlayerActionInfo
{
    public int MemberId { get; set; }
    public string Username { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public DateTime? RegisteredDate { get; set; }
}

