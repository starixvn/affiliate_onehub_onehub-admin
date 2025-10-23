using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.UserPanel;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.StatementHistory.Queries;

public record GetDailyEarningDetailQuery(DailyEarningParamDto Param) : IRequest<DailyEarningDetailResultDto>;

public class GetDailyEarningDetailQueryHandler(
    IDynamicRepository repository,
    ILogger<GetDailyEarningDetailQueryHandler> logger)
    : IRequestHandler<GetDailyEarningDetailQuery, DailyEarningDetailResultDto>
{
    public async Task<DailyEarningDetailResultDto> Handle(
        GetDailyEarningDetailQuery request,
        CancellationToken cancellationToken)
    {
        var rawData = await repository.FetchAsync<DailyEarningDetailDto>(request.Param);
        var list = rawData.ToList();

        var total = new DailyEarningDetailDto();
        foreach (var item in list)
        {
            total.Turnover += item.Turnover;
            total.Ggr += item.Ggr;
            total.Deposit += item.Deposit;
            total.Withdrawal += item.Withdrawal;
            total.Bonus += item.Bonus;
            total.Rebate += item.Rebate;
        }

        return new DailyEarningDetailResultDto
        {
            MainData = list,
            Total = total
        };
    }
}

