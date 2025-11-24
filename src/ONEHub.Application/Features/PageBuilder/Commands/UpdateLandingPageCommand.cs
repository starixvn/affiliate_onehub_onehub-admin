using Fanex.Data;
using MediatR;
using ONEHub.Application.Features.Shared;
using ONEHub.Domain.Params;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Features.PageBuilder.Commands;

public class UpdateLandingPageCommand : BaseNonResultCommand
{
    public string PageCode { get; set; }
    public string PageName { get; set; }
    public int CampaignId { get; set; }
    public string ComponentStructure { get; set; }
    public string TargetCountryCode { get; set; }
    [SpParam(SqlParamName = "MarketId")]
    public string LanguageCode { get; set; }
    public int StatusId { get; set; }
    public int PageId { get; set; }
    public bool IsPreview { get; set; }
}

public class UpdateLandingPageHandler(
    IPageBuilderRepository pageBuilderRepository)
    : IRequestHandler<UpdateLandingPageCommand, Result>
{
    public async Task<Result> Handle(UpdateLandingPageCommand request, CancellationToken cancellationToken)
    {
        var param = new PageBuilderParam
        {
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

        var createResult = await pageBuilderRepository.UpdateLandingPageAsync(param);

        return createResult;
    }
}
