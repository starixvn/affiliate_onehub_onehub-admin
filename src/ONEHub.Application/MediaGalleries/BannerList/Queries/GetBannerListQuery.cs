using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.MediaGalleries;
using ONEHub.Domain.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.MediaGalleries.BannerList.Queries;

public record GetBannerListQuery(BannerParamDto Param) : IRequest<EntityResult<BannerInfoDto>>;

public class GetBannerListQueryHandler(
    IDynamicRepository repository,
    ILogger<GetBannerListQueryHandler> logger)
    : IRequestHandler<GetBannerListQuery, EntityResult<BannerInfoDto>>
{
    public async Task<EntityResult<BannerInfoDto>> Handle(
        GetBannerListQuery request,
        CancellationToken cancellationToken)
    {
        var results = await repository.FetchAsync<BannerInfoDto>(request.Param);
        var list = results.ToList();

        return new EntityResult<BannerInfoDto>
        {
            MainData = list,
            TotalItem = list.Count,
            PageIndex = request.Param.PageIndex,
            PageSize = request.Param.PageSize
        };
    }
}

