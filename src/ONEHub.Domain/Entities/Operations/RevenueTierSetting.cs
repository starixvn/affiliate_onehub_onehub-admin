namespace ONEHub.Domain.Entities.Operations;

public class RevenueTierSetting
{
    public int TierId { get; set; }
    public int GroupProductId { get; set; }
    public decimal MinimumAmount { get; set; }
    public int MinimumQualifiedMembers { get; set; }
    public decimal Commission { get; set; }
}

