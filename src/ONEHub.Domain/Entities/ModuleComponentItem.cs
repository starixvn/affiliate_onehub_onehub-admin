namespace ONEHub.Domain.Entities;

public class ModuleComponentItem
{
    public int ModuleId { get; set; }
    public int? MediaId { get; set; }
    public string ExtraInfo { get; set; } = string.Empty;
    public int OrderId { get; set; }
}
