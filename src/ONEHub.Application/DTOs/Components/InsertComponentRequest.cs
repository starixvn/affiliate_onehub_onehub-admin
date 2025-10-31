using ONEHub.Domain.DTOs.Common;

namespace ONEHub.Application.DTOs.Components;

public class InsertComponentRequest : UserInfoRequest
{
    public string ComponentName { get; set; } = string.Empty;
    public string ComponentCode { get; set; } = string.Empty;
    public int ComponentTypeId { get; set; }
    public int StatusId { get; set; }
}

