using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.UserPanel;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.StatementHistory.Queries;

public record GetDailyEarningQuery(DailyEarningParamDto Param) : IRequest<DailyEarningResultDto>;

public class GetDailyEarningQueryHandler(
    IDynamicRepository repository,
    ILogger<GetDailyEarningQueryHandler> logger)
    : IRequestHandler<GetDailyEarningQuery, DailyEarningResultDto>
{
    public async Task<DailyEarningResultDto> Handle(
        GetDailyEarningQuery request,
        CancellationToken cancellationToken)
    {
        var mainData = await repository.FetchAsync<DailyEarningDto>(request.Param);
        var total = await repository.GetAsync<DailyEarningDto>(request.Param);

        return new DailyEarningResultDto
        {
            MainData = mainData,
            Total = total
        };
    }
}

