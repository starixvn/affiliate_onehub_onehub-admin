namespace ONEHub.Application.DTOs.Operations;

public class RevenueTierSettingDto
{
    public int TierId { get; set; }
    public int GroupProductId { get; set; }
    public decimal MinAmount { get; set; }
    public int MinQm { get; set; }
    public decimal Commission { get; set; }
}

