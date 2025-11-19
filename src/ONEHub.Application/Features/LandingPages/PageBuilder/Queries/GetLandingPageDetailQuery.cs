using MediatR;
using ONEHub.Application.Features.Shared;
using ONEHub.Domain.Errors;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Features.LandingPages.PageBuilder.Queries;

public class GetLandingPageDetailQuery : BaseQuery<LandingPageDetailResponse>
{
    public int PageId { get; set; }
}

public record LandingPageDetailResponse(int PageId, string PageName, string PageCode, string TargetCountryCode, string LanguageCode, int StatusId);

public class GetPageManagementDetailHandler(IPageBuilderRepository pageBuilderRepository)
    : IRequestHandler<GetLandingPageDetailQuery, Result<LandingPageDetailResponse>>
{
    public async Task<Result<LandingPageDetailResponse>> Handle(GetLandingPageDetailQuery request, CancellationToken cancellationToken)
    {
        var landingPageDetailResult = await pageBuilderRepository.GetLandingPageDetailAsync(request.PageId);

        if (landingPageDetailResult.IsFailure)
        {
            return Result<LandingPageDetailResponse>.Failure(landingPageDetailResult.Error);
        }

        if (landingPageDetailResult.Data is null)
        {
            return Result<LandingPageDetailResponse>.Failure(Error.NoData);
        }

        var data = new LandingPageDetailResponse(
            landingPageDetailResult.Data.PageId,
            landingPageDetailResult.Data.PageName,
            landingPageDetailResult.Data.PageCode,
            landingPageDetailResult.Data.TargetCountryCode,
            landingPageDetailResult.Data.LanguageCode,
            landingPageDetailResult.Data.StatusId
        );

        return Result<LandingPageDetailResponse>.Success(data);
    }
}
