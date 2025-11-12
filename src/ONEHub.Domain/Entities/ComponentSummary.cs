namespace ONEHub.Domain.Entities;

public class ComponentSummary
{
    public int ComponentTypeId { get; set; }
    public string ComponentTypeName { get; set; } = string.Empty;
    public int Total { get; set; }
    public int Active { get; set; }
    public int Inactive { get; set; }
}
