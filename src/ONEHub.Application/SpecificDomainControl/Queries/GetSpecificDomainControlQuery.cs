using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Domains;
using ONEHub.Domain.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.SpecificDomainControl.Queries;

public record GetSpecificDomainControlQuery(SpecificDomainControlParamDto Param)
    : IRequest<EntityResult<SpecificDomainControlInfoDto>>;

public class GetSpecificDomainControlQueryHandler(
    IDynamicRepository repository,
    ILogger<GetSpecificDomainControlQueryHandler> logger)
    : IRequestHandler<GetSpecificDomainControlQuery, EntityResult<SpecificDomainControlInfoDto>>
{
    public async Task<EntityResult<SpecificDomainControlInfoDto>> Handle(
        GetSpecificDomainControlQuery request,
        CancellationToken cancellationToken)
    {
        try
        {
            var results = await repository.FetchAsync<SpecificDomainControlInfoDto>(request.Param);
            var list = results.ToList();

            return new EntityResult<SpecificDomainControlInfoDto>
            {
                MainData = list,
                TotalItem = list.FirstOrDefault()?.RowNum ?? 0,
                PageIndex = request.Param.PageIndex,
                PageSize = request.Param.PageSize
            };
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error fetching specific domain control: {@Param}", request.Param);
            return new EntityResult<SpecificDomainControlInfoDto>();
        }
    }
}

