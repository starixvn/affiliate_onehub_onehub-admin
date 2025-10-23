using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.UserPanel;
using ONEHub.Domain.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.UserPanel.Queries;

public record GetCustomerMemberQuery(CustomerMemberParamDto Param) : IRequest<EntityResult<CustomerMemberDto>>;

public class GetCustomerMemberQueryHandler(
    IDynamicRepository repository,
    ILogger<GetCustomerMemberQueryHandler> logger)
    : IRequestHandler<GetCustomerMemberQuery, EntityResult<CustomerMemberDto>>
{
    public async Task<EntityResult<CustomerMemberDto>> Handle(
        GetCustomerMemberQuery request,
        CancellationToken cancellationToken)
    {
        try
        {
            var results = await repository.FetchAsync<CustomerMemberDto>(request.Param);
            var list = results.ToList();

            return new EntityResult<CustomerMemberDto>
            {
                MainData = list,
                TotalItem = list.FirstOrDefault()?.RowNum ?? 0,
                PageIndex = request.Param.PageIndex,
                PageSize = request.Param.PageSize
            };
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error fetching customer members with params: {@Param}", request.Param);
            return new EntityResult<CustomerMemberDto>();
        }
    }
}

