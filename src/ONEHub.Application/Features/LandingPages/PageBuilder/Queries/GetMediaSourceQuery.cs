using MediatR;
using ONEHub.Application.Features.Shared;
using ONEHub.Domain.Errors;
using ONEHub.Domain.Params;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Features.LandingPages.PageBuilder.Queries;

public class GetMediaSourceQuery : BaseQuery<IEnumerable<MediaSourceResponse>>
{
    public int ModuleId { get; set; }
    public string TargetCountryCode { get; set; } = string.Empty;
    public string LanguageCode { get; set; } = string.Empty;
}

public record MediaSourceResponse(
    int ModuleId,
    int MediaId,
    string MediaName,
    string FileName,
    string Dimension);

public class GetMediaSourceHandler(IPageBuilderRepository pageBuilderRepository)
    : IRequestHandler<GetMediaSourceQuery, Result<IEnumerable<MediaSourceResponse>>>
{
    public async Task<Result<IEnumerable<MediaSourceResponse>>> Handle(GetMediaSourceQuery request, CancellationToken cancellationToken)
    {
        var param = new MediaSourceParam
        {
            ModuleId = request.ModuleId,
            TargetCountryCode = request.TargetCountryCode,
            LanguageCode = request.LanguageCode
        };

        var mediaSourceResult = await pageBuilderRepository.GetMediaSourceAsync(param);

        if (mediaSourceResult.IsFailure)
        {
            return Result<IEnumerable<MediaSourceResponse>>.Failure(mediaSourceResult.Error);
        }

        if (mediaSourceResult.Data is null)
        {
            return Result<IEnumerable<MediaSourceResponse>>.Failure(Error.NoData);
        }

        var result = mediaSourceResult.Data.Select(mediaSource => new MediaSourceResponse(
            mediaSource.ModuleId,
            mediaSource.MediaId,
            mediaSource.MediaName,
            mediaSource.FileName,
            mediaSource.Dimension));

        return Result<IEnumerable<MediaSourceResponse>>.Success(result);
    }
}
