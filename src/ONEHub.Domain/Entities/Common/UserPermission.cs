namespace ONEHub.Domain.Entities.Common;

public class UserPermission
{
    public int UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public int FunctionId { get; set; }
    public string FunctionName { get; set; } = string.Empty;
    public bool CanView { get; set; }
    public bool CanCreate { get; set; }
    public bool CanEdit { get; set; }
    public bool CanDelete { get; set; }
}

