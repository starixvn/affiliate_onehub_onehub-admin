using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Members;
using ONEHub.Domain.Criterias.Members;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Members.Queries;

public record GetMemberDetailQuery(int MemberId) : IRequest<PlayerActionInfoDto?>;

public class GetMemberDetailQueryHandler(
    IDynamicRepository repository,
    ILogger<GetMemberDetailQueryHandler> logger)
    : IRequestHandler<GetMemberDetailQuery, PlayerActionInfoDto?>
{
    public async Task<PlayerActionInfoDto?> Handle(
        GetMemberDetailQuery request,
        CancellationToken cancellationToken)
    {
        try
        {
            var criteria = new MemberDetailCriteria { MemberId = request.MemberId };
            var result = await repository.GetAsync<PlayerActionInfoDto>(criteria);
            return result;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error fetching member detail for MemberId: {MemberId}", request.MemberId);
            return null;
        }
    }
}

