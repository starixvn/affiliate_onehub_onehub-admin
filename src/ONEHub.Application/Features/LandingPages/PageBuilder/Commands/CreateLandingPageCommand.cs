using MediatR;
using Newtonsoft.Json;
using ONEHub.Domain.Params;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Features.LandingPages.PageBuilder.Commands;

public class CreateLandingPageCommand : BaseLandingPageCommand
{
    public string PageCode { get; set; } = string.Empty;
    public bool IsPreview { get; set; }
}

public class CreateLandingPageHandler(
    IPageBuilderRepository pageBuilderRepository)
    : IRequestHandler<CreateLandingPageCommand, Result>
{
    public async Task<Result> Handle(CreateLandingPageCommand request, CancellationToken cancellationToken)
    {
        var param = new CreateLandingPageParam
        {
            PageName = request.PageName,
            PageCode = request.PageCode,
            CampaignId = request.CampaignId,
            ModuleComponentsSetting = JsonConvert.SerializeObject(request.ModuleComponentsSetting),
            TargetCountryCode = request.TargetCountryCode,
            LanguageCode = request.LanguageCode,
            StatusId = request.StatusId,
            IsPreview = request.IsPreview,
            UserId = request.UserId,
            Ip = request.Ip,
            Host = request.Host,
        };

        var createResult = await pageBuilderRepository.CreateLandingPageAsync(param);

        return createResult;
    }
}
