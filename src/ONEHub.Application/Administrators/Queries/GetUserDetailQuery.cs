using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Administrators;
using ONEHub.Domain.Criterias.Administrators;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Administrators.Queries;

public record GetUserDetailQuery(int UserId) : IRequest<AdministratorInfoDto?>;

public class GetUserDetailQueryHandler(
    IDynamicRepository repository,
    ILogger<GetUserDetailQueryHandler> logger)
    : IRequestHandler<GetUserDetailQuery, AdministratorInfoDto?>
{
    public async Task<AdministratorInfoDto?> Handle(
        GetUserDetailQuery request,
        CancellationToken cancellationToken)
    {
        var criteria = new AdministratorDetailCriteria { UserId = request.UserId };
        return await repository.GetAsync<AdministratorInfoDto>(criteria);
    }
}

