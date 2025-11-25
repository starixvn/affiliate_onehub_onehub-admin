using MediatR;
using ONEHub.Application.Features.Shared;
using ONEHub.Domain.Entities;
using ONEHub.Domain.Errors;
using ONEHub.Domain.Params;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Features.LandingPages.PageManagement.Queries;

public class GetLandingPageListQuery : PagingQuery<LandingPageResponse>
{
    public string? Search { get; set; } = string.Empty;

    public string? StatusIds { get; set; } = string.Empty;

    public string? TargetCountryCodes { get; set; } = string.Empty;

    public string? LanguageCodes { get; set; } = string.Empty;

    public DateTime? FromDate { get; set; }

    public DateTime? ToDate { get; set; }

    public bool? IsExportExcel { get; set; }
}

public record LandingPageResponse(
    int PageId,
    string CampaignCode,
    string CampaignName,
    string LpName,
    string LpCode,
    string CountryCode,
    string CountryName,
    string LanguageCode,
    string LanguageName,
    string TargetLanguageCode,
    string CreatedDate,
    string CreatedBy,
    string ModifiedBy,
    string ModifiedDate,
    byte StatusId,
    string Status,
    int Click,
    int Registration,
    int FTD,
    int Revenue,
    int RowIdx);

public class GetLandingPageListHandler(IPageManagementRepository pageManagementRepository)
    : IRequestHandler<GetLandingPageListQuery, Result<PagingData<LandingPageResponse>>>
{
    public async Task<Result<PagingData<LandingPageResponse>>> Handle(GetLandingPageListQuery request, CancellationToken cancellationToken)
    {
        var param = new LandingPageListParam
        {
            Search = request.Search,
            StatusIds = request.StatusIds,
            TargetCountryCodes = request.TargetCountryCodes,
            LanguageCodes = request.LanguageCodes,
            FromDate = request.FromDate,
            ToDate = request.ToDate,
            PageIndex = request.PageIndex,
            PageSize = request.PageSize,
            IsExportExcel = request.IsExportExcel
        };

        var landingPageListResult = await pageManagementRepository.GetLandingPageListAsync(param);

        if (landingPageListResult.IsFailure)
        {
            return Result<PagingData<LandingPageResponse>>.Failure(landingPageListResult.Error);
        }

        if (landingPageListResult.Data is null)
        {
            return Result<PagingData<LandingPageResponse>>.Failure(Error.NoData);
        }

        var result = new PagingData<LandingPageResponse>
        {
            Items = [.. landingPageListResult.Data.Items.Select(landingPage => new LandingPageResponse(
                landingPage.PageId,
                landingPage.CampaignCode,
                landingPage.CampaignName,
                landingPage.PageName,
                landingPage.PageCode,
                landingPage.TargetCountryCode,
                landingPage.TargetCountryName,
                landingPage.MarketId,
                landingPage.Language,
                landingPage.TargetLanguageCode,
                landingPage.CreatedDate.ToString("MM/dd/yyyy"),
                landingPage.CreatedBy,
                landingPage.LastModifiedBy,
                landingPage.LastModifiedDate.ToString("MM/dd/yyyy"),
                landingPage.StatusId,
                landingPage.Status,
                landingPage.Click,
                landingPage.Registration,
                landingPage.FTD,
                landingPage.Revenue,
                landingPage.RowIdx
            ))],
            TotalItem = landingPageListResult.Data.TotalItem,
            PageIndex = request.PageIndex,
            PageSize = request.PageSize
        };

        return Result<PagingData<LandingPageResponse>>.Success(result);
    }
}
