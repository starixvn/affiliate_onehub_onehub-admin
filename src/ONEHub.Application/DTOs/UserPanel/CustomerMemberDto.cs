namespace ONEHub.Application.DTOs.UserPanel;

public class CustomerMemberDto
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Currency { get; set; } = string.Empty;
    public DateTime? RegisteredDate { get; set; }
    public int? RowNum { get; set; }
}

