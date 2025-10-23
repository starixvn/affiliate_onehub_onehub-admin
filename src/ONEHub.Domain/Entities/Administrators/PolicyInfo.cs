namespace ONEHub.Domain.Entities.Administrators;

public class PolicyInfo
{
    public int ParentId { get; set; }
    public int Policy { get; set; }
    public int FunctionId { get; set; }
    public string FunctionDescription { get; set; } = string.Empty;
    public byte GroupPolicy { get; set; }
}

