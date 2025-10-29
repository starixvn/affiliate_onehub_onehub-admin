using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.MediaGalleries;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Features.MediaGalleries.BannerList.Queries;

public record GetBannerDetailQuery(int SelectedBannerId, byte UserType) : IRequest<BannerInfoDto?>;

public class GetBannerDetailQueryHandler(
    IDynamicRepository repository,
    ILogger<GetBannerDetailQueryHandler> logger)
    : IRequestHandler<GetBannerDetailQuery, BannerInfoDto?>
{
    public async Task<BannerInfoDto?> Handle(
        GetBannerDetailQuery request,
        CancellationToken cancellationToken)
    {
        return await repository.GetAsync<BannerInfoDto>(new
        {
            request.SelectedBannerId,
            request.UserType
        });
    }
}

