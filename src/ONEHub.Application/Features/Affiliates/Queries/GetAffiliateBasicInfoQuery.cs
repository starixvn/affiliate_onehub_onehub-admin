using ONEHub.Application.Common;
using ONEHub.Application.DTOs.Affiliates;

namespace ONEHub.Application.Features.Affiliates.Queries;

public class GetAffiliateBasicInfoQuery : BaseQuery<AffiliateBasicInfoDto?>
{
    public int? AffiliateId { get; set; }
    public string AffiliateName { get; set; } = string.Empty;
}

