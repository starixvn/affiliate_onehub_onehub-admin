namespace ONEHub.Domain.Entities.Customers;

public class CustomerStatistics
{
    public int SignupsByMonth { get; set; }
    public int FirstDepositsByMonth { get; set; }
    public int SignupsTotal { get; set; }
    public int FirstDepositsTotal { get; set; }
    public int ActivePlayersByMonth { get; set; }
    public decimal DepositByMonth { get; set; }
    public decimal TotalFirstDepositAmountByMonth { get; set; }
    public decimal DepositTotal { get; set; }
    public decimal TotalFirstDepositAmount { get; set; }
    public decimal FirstDepositTotalDepositByMonth { get; set; }
    public decimal TurnoverByMonth { get; set; }
    public decimal TurnoverTotal { get; set; }
    public decimal GrossGamingRevenueByMonth { get; set; }
    public decimal GrossGamingRevenueTotal { get; set; }
    public int UniqueClickPCByMonth { get; set; }
    public int TotalClickPCByMonth { get; set; }
    public int UniqueClickMobileByMonth { get; set; }
    public int TotalClickMobileByMonth { get; set; }
    public int NumberOfSubAffiliatesByMonth { get; set; }
    public int NumberOfSubAffiliatesTotal { get; set; }
    public int QualifiedMembersByMonth { get; set; }
}

