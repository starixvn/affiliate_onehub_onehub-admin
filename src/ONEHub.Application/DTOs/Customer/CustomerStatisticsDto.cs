namespace ONEHub.Application.DTOs.Customer
{
    public class CustomerStatisticsDto
    {
        public int SignupsByMonth { get; set; }
        public int FdmByMonth { get; set; }
        public int SignupsTotal { get; set; }
        public int FdmTotal { get; set; }
        public int ActivePlayersByMonth { get; set; }
        public decimal DepositByMonth { get; set; }
        public decimal TotalFDMAmountByMonth { get; set; }
        public decimal DepositTotal { get; set; }
        public decimal TotalFDMAmount { get; set; }
        public decimal FDM_TotalDepositByMonth { get; set; }
        public decimal TurnoverByMonth { get; set; }
        public decimal TurnoverTotal { get; set; }
        public decimal GgrByMonth { get; set; }
        public decimal GgrTotal { get; set; }
        public int UniqueClickPCByMonth { get; set; }
        public int TotalClickPCByMonth { get; set; }
        public int UniqueClickMobileByMonth { get; set; }
        public int TotalClickMobileByMonth { get; set; }
        public int NoOfSubAffByMonth { get; set; }
        public int NoOfSubAffTotal { get; set; }
        public int QualifiedMembersByMonth { get; set; }
    }
}

