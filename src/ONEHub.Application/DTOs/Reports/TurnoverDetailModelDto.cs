namespace ONEHub.Application.DTOs.Reports;

public class TurnoverDetailModelDto
{
    public TurnoverGroupByProductDto? Total { get; set; }
    public IEnumerable<TurnoverGroupByProductDto> Groups { get; set; } = [];
}

public class TurnoverGroupByProductDto
{
    public int MemberCPAId { get; set; }
    public int MemberCPATierId { get; set; }
    public int GroupProductId { get; set; }
    public string ProductIds { get; set; } = string.Empty;
    public decimal MinFdm { get; set; }
    public decimal MinTotalDeposit { get; set; }
    public decimal MinTO { get; set; }
    public decimal CpaAmount { get; set; }
    public IEnumerable<TurnoverGroupByProductDetailDto> Products { get; set; } = [];
}

public class TurnoverGroupByProductDetailDto
{
    public int MemberCPAId { get; set; }
    public int MemberCPATierId { get; set; }
    public int GroupProductId { get; set; }
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public decimal Turnover { get; set; }
}

