using Fanex.Data;
using MediatR;
using ONEHub.Application.Features.Shared;
using ONEHub.Domain.Params;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Features.PageBuilder.Commands;

public class CreateLandingPageCommand : BaseNonResultCommand
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

public class CreateLandingPageHandler(
    IPageBuilderRepository pageBuilderRepository)
    : IRequestHandler<CreateLandingPageCommand, Result>
{
    public async Task<Result> Handle(CreateLandingPageCommand request, CancellationToken cancellationToken)
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

        var createResult = await pageBuilderRepository.CreateLandingPageAsync(param);

        return createResult;
    }
}
