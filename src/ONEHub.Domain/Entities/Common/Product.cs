namespace ONEHub.Domain.Entities.Common;

public class Product
{
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string ProductCode { get; set; } = string.Empty;
    public bool IsActive { get; set; }
}

