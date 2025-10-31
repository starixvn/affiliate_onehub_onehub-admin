namespace ONEHub.Domain.DTOs.Components;

public class ComponentInfo
{
    public int ComponentId { get; set; }
    public string ComponentName { get; set; } = string.Empty;
    public string ComponentCode { get; set; } = string.Empty;
    public int ComponentTypeId { get; set; }
    public int StatusId { get; set; }
    public string Status { get; set; } = string.Empty;
}

