using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Reports;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Reports.Queries;

public record GetTurnoverDetailQuery(int MemberCpaId) : IRequest<TurnoverDetailModelDto?>;

public class GetTurnoverDetailQueryHandler(
    IDynamicRepository repository,
    ILogger<GetTurnoverDetailQueryHandler> logger)
    : IRequestHandler<GetTurnoverDetailQuery, TurnoverDetailModelDto?>
{
    public async Task<TurnoverDetailModelDto?> Handle(
        GetTurnoverDetailQuery request,
        CancellationToken cancellationToken)
    {
        try
        {
            var groupByProducts = await repository.FetchAsync<TurnoverGroupByProductDto>(
                new { MemberCpaId = request.MemberCpaId });

            var groupByProductDetails = await repository.FetchAsync<TurnoverGroupByProductDetailDto>(
                new { MemberCpaId = request.MemberCpaId });

            var total = await repository.GetAsync<TurnoverGroupByProductDto>(
                new { MemberCpaId = request.MemberCpaId });

            var groupsList = groupByProducts.Select(group =>
            {
                group.Products = groupByProductDetails.Where(detail =>
                    detail.MemberCPAId == group.MemberCPAId
                    && detail.MemberCPATierId == group.MemberCPATierId
                    && detail.GroupProductId == group.GroupProductId);
                return group;
            });

            return new TurnoverDetailModelDto
            {
                Total = total,
                Groups = groupsList
            };
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error fetching turnover detail");
            return null;
        }
    }
}

