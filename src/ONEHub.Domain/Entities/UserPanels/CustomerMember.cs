namespace ONEHub.Domain.Entities.UserPanels;

public class CustomerMember
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Currency { get; set; } = string.Empty;
    public DateTime? RegisteredDate { get; set; }
}

