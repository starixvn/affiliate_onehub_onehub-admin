using MediatR;
using ONEHub.Application.Features.Shared;
using ONEHub.Domain.Entities;
using ONEHub.Domain.Params;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Features.PageBuilder.Queries;

public class GetPageBuilderDetailQuery : BaseQuery<PageBuilderDetail>
{
    public int PageId { get; set; }

    public string PageCode { get; set; } = string.Empty;

    public bool IsPreview { get; set; }
}

public class GetPageBuilderDetailHandler(
    IPageBuilderRepository pageBuilderRepository)
    : IRequestHandler<GetPageBuilderDetailQuery, Result<PageBuilderDetail>>
{
    public async Task<Result<PageBuilderDetail>> Handle(GetPageBuilderDetailQuery request, CancellationToken cancellationToken)
    {
        var param = new GetPageBuilderParam
        {
            PageId = request.PageId,
            PageCode = request.PageCode,
            IsPreview = request.IsPreview
        };
        return await pageBuilderRepository.GetPageBuilderDetailAsync(param);
    }
}
