using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Administrators;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Administrators.Queries;

public record GetUserListQuery(int GroupId, string UserName, string FirstLetter) : IRequest<IEnumerable<AdministratorInfoDto>>;

public class GetUserListQueryHandler(
    IDynamicRepository repository,
    ILogger<GetUserListQueryHandler> logger)
    : IRequestHandler<GetUserListQuery, IEnumerable<AdministratorInfoDto>>
{
    public async Task<IEnumerable<AdministratorInfoDto>> Handle(
        GetUserListQuery request,
        CancellationToken cancellationToken)
    {
        var criteria = new
        {
            GroupId = request.GroupId != 0 ? (int?)request.GroupId : null,
            UserName = $"%{request.UserName}%",
            FirstChar = request.FirstLetter == "0-9" ? $"[{request.FirstLetter}]%" : $"{request.FirstLetter}%"
        };

        return await repository.FetchAsync<AdministratorInfoDto>(criteria);
    }
}

