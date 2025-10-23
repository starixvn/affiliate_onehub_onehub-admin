using ONEHub.Application.Common;
using ONEHub.Application.DTOs.Affiliates;

namespace ONEHub.Application.Affiliates.Queries;

public class GetMarketingAccountQuery : BaseQuery<MarketingAccountDto>
{
    public int AffiliateId { get; set; }
}

