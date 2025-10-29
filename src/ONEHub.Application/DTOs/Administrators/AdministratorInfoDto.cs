namespace ONEHub.Application.DTOs.Administrators;

public class AdministratorInfoDto
{
    public int UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public bool Closed { get; set; }
    public bool IsOpen => !Closed;
    public string Creator { get; set; } = string.Empty;
    public int GroupId { get; set; }
    public string GroupName { get; set; } = string.Empty;
    public DateTime? CreatedDate { get; set; }
}

