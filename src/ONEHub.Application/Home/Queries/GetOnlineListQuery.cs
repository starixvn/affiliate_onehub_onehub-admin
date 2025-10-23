using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Home;
using ONEHub.Domain.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Home.Queries;

public record GetOnlineListQuery(int PageIndex, int PageSize) : IRequest<EntityResult<OnlineListInfoDto>>;

public class GetOnlineListQueryHandler(
    IDynamicRepository repository,
    ILogger<GetOnlineListQueryHandler> logger)
    : IRequestHandler<GetOnlineListQuery, EntityResult<OnlineListInfoDto>>
{
    public async Task<EntityResult<OnlineListInfoDto>> Handle(
        GetOnlineListQuery request,
        CancellationToken cancellationToken)
    {
        try
        {
            var criteria = new UserOnlineCriteria
            {
                PageIndex = request.PageIndex,
                PageSize = request.PageSize
            };

            var results = await repository.FetchAsync<OnlineListInfoDto>(criteria);
            var list = results.ToList();

            return new EntityResult<OnlineListInfoDto>
            {
                MainData = list,
                TotalItem = list.FirstOrDefault()?.RowNum ?? 0,
                PageIndex = request.PageIndex,
                PageSize = request.PageSize
            };
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error fetching online list, PageIndex: {PageIndex}, PageSize: {PageSize}",
                request.PageIndex, request.PageSize);
            return new EntityResult<OnlineListInfoDto>();
        }
    }
}

