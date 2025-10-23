using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Customer;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Customer.Queries;

public record GetCustomerStatisticsQuery(CustomerStatisticsParamDto Param) : IRequest<CustomerStatisticsDto>;

public class GetCustomerStatisticsQueryHandler(
    IDynamicRepository repository,
    ILogger<GetCustomerStatisticsQueryHandler> logger)
    : IRequestHandler<GetCustomerStatisticsQuery, CustomerStatisticsDto>
{
    public async Task<CustomerStatisticsDto> Handle(
        GetCustomerStatisticsQuery request,
        CancellationToken cancellationToken)
    {
        var result = await repository.FetchAsync<CustomerStatisticsDto>(request.Param);
        return result.FirstOrDefault() ?? new CustomerStatisticsDto();
    }
}

