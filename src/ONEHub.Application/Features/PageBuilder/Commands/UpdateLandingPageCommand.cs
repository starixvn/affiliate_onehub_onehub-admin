using Fanex.Data;
using MediatR;
using Microsoft.Extensions.Configuration;
using ONEHub.Application.Features.Shared;
using ONEHub.Domain.Params;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Features.PageBuilder.Commands;

public class UpdateLandingPageCommand : BaseCommand<LandingResponse>
{
    public string PageCode { get; set; } = string.Empty;
    public string PageName { get; set; } = string.Empty;
    public int CampaignId { get; set; }
    public string ComponentStructure { get; set; } = string.Empty;
    public string TargetCountryCode { get; set; } = string.Empty;
    [SpParam(SqlParamName = "MarketId")]
    public string LanguageCode { get; set; } = string.Empty;
    public int StatusId { get; set; }
    public int PageId { get; set; }
    public bool IsPreview { get; set; }
}

public class UpdateLandingPageHandler(
    IConfiguration configuration,
    IPageBuilderRepository pageBuilderRepository)
    : IRequestHandler<UpdateLandingPageCommand, Result<LandingResponse>>
{
    public async Task<Result<LandingResponse>> Handle(UpdateLandingPageCommand request, CancellationToken cancellationToken)
    {
        var param = new PageBuilderParam
        {
            PageId = request.PageId,
            PageCode = request.PageCode,
            PageName = request.PageName,
            CampaignId = request.CampaignId,
            ComponentStructure = request.ComponentStructure,
            TargetCountryCode = request.TargetCountryCode,
            StatusId = request.StatusId,
            MarketId = request.LanguageCode,
            IsPreview = request.IsPreview,
            UserId = request.UserId,
            Ip = request.Ip,
            Host = request.Host
        };

        var result = await pageBuilderRepository.UpdateLandingPageAsync(param);
        if (result.IsSuccess)
        {
            var responseData = GetResponseData(param);
            return Result<LandingResponse>.Success(responseData);
        }
        else
        {
            return Result<LandingResponse>.Failure(result.Error);
        }
    }

    private LandingResponse GetResponseData(PageBuilderParam param)
    {
        var appSettings = configuration.GetSection("AppSettings");
        var bannerRootUrl = appSettings["LandingPageUrl"] ?? string.Empty;
        var queryString = param.IsPreview ? $"?pageId={param.PageId}&isPreview={param.IsPreview}" : string.Empty;
        var landingPageUrl = $"{bannerRootUrl}/{param.TargetCountryCode}/{param.PageCode}{queryString}";
        var responseData = new LandingResponse(PageId: param.PageId, landingPageUrl);
        return responseData;
    }
}
