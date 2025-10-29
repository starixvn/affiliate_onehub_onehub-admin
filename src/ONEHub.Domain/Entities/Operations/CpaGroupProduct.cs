namespace ONEHub.Domain.Entities.Operations;

public class CpaGroupProduct
{
    public int GroupProductId { get; set; }
    public int GroupId { get; set; }
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public bool IsActive { get; set; }
}

