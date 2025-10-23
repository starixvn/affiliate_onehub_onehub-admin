using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.UserPanel;
using ONEHub.Domain.Criterias.UserPanel;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.UserAccount.Queries;

public record GetUserAccountInfoQuery(int AffId) : IRequest<UserAccountDto?>;

public class GetUserAccountInfoQueryHandler(
    IDynamicRepository repository,
    ILogger<GetUserAccountInfoQueryHandler> logger)
    : IRequestHandler<GetUserAccountInfoQuery, UserAccountDto?>
{
    public async Task<UserAccountDto?> Handle(
        GetUserAccountInfoQuery request,
        CancellationToken cancellationToken)
    {
        var criteria = new UserAccountDetailCriteria { AffId = request.AffId };
        return await repository.GetAsync<UserAccountDto>(criteria);
    }
}

