using MediatR;
using Newtonsoft.Json;
using ONEHub.Domain.Params;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Features.LandingPages.PageBuilder.Commands;

public class UpdateLandingPageCommand : BaseLandingPageCommand
{
    public int PageId { get; set; }
}

public class UpdateLandingPageHandler(
    IPageBuilderRepository pageBuilderRepository)
    : IRequestHandler<UpdateLandingPageCommand, Result>
{
    public async Task<Result> Handle(UpdateLandingPageCommand request, CancellationToken cancellationToken)
    {
        var param = new UpdateLandingPageParam
        {
            PageId = request.PageId,
            PageName = request.PageName,
            CampaignId = request.CampaignId,
            ModuleComponentsSetting = JsonConvert.SerializeObject(request.ModuleComponentsSetting),
            TargetCountryCode = request.TargetCountryCode,
            LanguageCode = request.LanguageCode,
            StatusId = request.StatusId,
            UserId = request.UserId,
            Ip = request.Ip,
            Host = request.Host
        };

        var result = await pageBuilderRepository.UpdateLandingPageAsync(param);
        return result;
    }
}
