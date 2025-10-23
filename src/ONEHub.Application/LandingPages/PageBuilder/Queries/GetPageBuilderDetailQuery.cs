using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.LandingPages;
using ONEHub.Domain.Criterias.LandingPages;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.LandingPages.PageBuilder.Queries;

public record GetPageBuilderDetailQuery(int PageId) : IRequest<PageBuilderDetailDto?>;

public class GetPageBuilderDetailQueryHandler(
    IDynamicRepository repository,
    ILogger<GetPageBuilderDetailQueryHandler> logger)
    : IRequestHandler<GetPageBuilderDetailQuery, PageBuilderDetailDto?>
{
    public async Task<PageBuilderDetailDto?> Handle(
        GetPageBuilderDetailQuery request,
        CancellationToken cancellationToken)
    {
        var criteria = new PageBuilderDetailCriteria { PageId = request.PageId };
        return await repository.GetAsync<PageBuilderDetailDto>(criteria);
    }
}

