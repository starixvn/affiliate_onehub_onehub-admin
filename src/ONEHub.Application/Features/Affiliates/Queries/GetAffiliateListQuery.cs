using ONEHub.Application.Common;
using ONEHub.Application.DTOs.Affiliates;

namespace ONEHub.Application.Features.Affiliates.Queries;

public class GetAffiliateListQuery : PaginatedQuery<AffiliateDto>
{
    public string AffiliateCode { get; set; } = string.Empty;
    public string GroupIds { get; set; } = string.Empty;
    public string TargetCountryCode { get; set; } = string.Empty;
    public string LanguageCode { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string ParentAffiliateName { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string AffCategoryIds { get; set; } = string.Empty;
    public bool IsExportExcel { get; set; }
}

