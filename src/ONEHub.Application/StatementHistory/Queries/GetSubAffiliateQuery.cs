using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.UserPanel;
using ONEHub.Domain.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.StatementHistory.Queries;

public record GetSubAffiliateQuery(SubAffiliateParamDto Param) : IRequest<EntityResult<SubAffiliateDto>>;

public class GetSubAffiliateQueryHandler(
    IDynamicRepository repository,
    ILogger<GetSubAffiliateQueryHandler> logger)
    : IRequestHandler<GetSubAffiliateQuery, EntityResult<SubAffiliateDto>>
{
    public async Task<EntityResult<SubAffiliateDto>> Handle(
        GetSubAffiliateQuery request,
        CancellationToken cancellationToken)
    {
        var results = await repository.FetchAsync<SubAffiliateDto>(request.Param);
        var list = results.ToList();

        return new EntityResult<SubAffiliateDto>
        {
            MainData = list,
            TotalItem = list.FirstOrDefault()?.AffId ?? 0,
            PageIndex = request.Param.PageIndex,
            PageSize = request.Param.PageSize
        };
    }
}

