namespace ONEHub.Domain.Entities;

public class ComponentInfo
{
    public int ComponentId { get; set; }

    public string ComponentCode { get; set; } = string.Empty;

    public string ComponentName { get; set; } = string.Empty;

    public int ComponentTypeId { get; set; }

    public DateTime CreatedDate { get; set; }

    public string CreatedBy { get; set; } = string.Empty;

    public DateTime LastModifiedDate { get; set; }

    public string LastModifiedBy { get; set; } = string.Empty;

    public int StatusId { get; set; }

    public string Status { get; set; } = string.Empty;

    public string? Device { get; set; }

    public int? DeviceId { get; set; }

    public int RowIdx { get; set; }
}
