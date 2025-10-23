using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Members;
using ONEHub.Domain.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Members.Queries;

public record GetMemberListQuery(MemberParamDto Param) : IRequest<EntityResult<MemberInfoDto>>;

public class GetMemberListQueryHandler(
    IDynamicRepository repository,
    ILogger<GetMemberListQueryHandler> logger)
    : IRequestHandler<GetMemberListQuery, EntityResult<MemberInfoDto>>
{
    public async Task<EntityResult<MemberInfoDto>> Handle(
        GetMemberListQuery request,
        CancellationToken cancellationToken)
    {
        try
        {
            var results = await repository.FetchAsync<MemberInfoDto>(request.Param);
            var list = results.ToList();

            return new EntityResult<MemberInfoDto>
            {
                MainData = list,
                TotalItem = list.FirstOrDefault()?.RowNum ?? 0,
                PageIndex = request.Param.PageIndex,
                PageSize = request.Param.PageSize
            };
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error fetching member list with params: {@Param}", request.Param);
            return new EntityResult<MemberInfoDto>();
        }
    }
}

