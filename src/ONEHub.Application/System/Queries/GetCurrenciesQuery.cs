using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Common;
using ONEHub.Domain.Criterias.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.SystemManagement.Queries;

public record GetBaseCurrenciesQuery : IRequest<IEnumerable<CurrencyDto>>;
public record GetCurrenciesQuery : IRequest<IEnumerable<CurrencyDto>>;
public record GetPaymentCurrenciesQuery : IRequest<IEnumerable<CurrencyDto>>;

public class GetBaseCurrenciesQueryHandler(
    IDynamicRepository repository,
    ICacheService cacheService,
    ILogger<GetBaseCurrenciesQueryHandler> logger)
    : IRequestHandler<GetBaseCurrenciesQuery, IEnumerable<CurrencyDto>>
{
    private const string CacheKey = "BaseCurrencyList";

    public async Task<IEnumerable<CurrencyDto>> Handle(
        GetBaseCurrenciesQuery request,
        CancellationToken cancellationToken)
    {
        try
        {
            var cached = await cacheService.GetAsync<IEnumerable<CurrencyDto>>(CacheKey);
            if (cached != null)
                return cached;

            var criteria = new SimpleCriteria("Aff_BaseCurrency_Sel");
            var results = await repository.FetchAsync<CurrencyDto>(criteria);
            await cacheService.SetAsync(CacheKey, results);
            return results;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error fetching base currencies");
            return Enumerable.Empty<CurrencyDto>();
        }
    }
}

public class GetCurrenciesQueryHandler(
    IDynamicRepository repository,
    ICacheService cacheService,
    ILogger<GetCurrenciesQueryHandler> logger)
    : IRequestHandler<GetCurrenciesQuery, IEnumerable<CurrencyDto>>
{
    private const string CacheKey = "CurrencyList";

    public async Task<IEnumerable<CurrencyDto>> Handle(
        GetCurrenciesQuery request,
        CancellationToken cancellationToken)
    {
        try
        {
            var cached = await cacheService.GetAsync<IEnumerable<CurrencyDto>>(CacheKey);
            if (cached != null)
                return cached;

            var criteria = new SimpleCriteria("Aff_Currency_Sel");
            var results = await repository.FetchAsync<CurrencyDto>(criteria);
            await cacheService.SetAsync(CacheKey, results);
            return results;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error fetching currencies");
            return Enumerable.Empty<CurrencyDto>();
        }
    }
}

public class GetPaymentCurrenciesQueryHandler(
    IDynamicRepository repository,
    ICacheService cacheService,
    ILogger<GetPaymentCurrenciesQueryHandler> logger)
    : IRequestHandler<GetPaymentCurrenciesQuery, IEnumerable<CurrencyDto>>
{
    private const string CacheKey = "PaymentCurrencyList";

    public async Task<IEnumerable<CurrencyDto>> Handle(
        GetPaymentCurrenciesQuery request,
        CancellationToken cancellationToken)
    {
        try
        {
            var cached = await cacheService.GetAsync<IEnumerable<CurrencyDto>>(CacheKey);
            if (cached != null)
                return cached;

            var criteria = new SimpleCriteria("Aff_PaymentCurrency_Sel");
            var results = await repository.FetchAsync<CurrencyDto>(criteria);
            await cacheService.SetAsync(CacheKey, results);
            return results;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error fetching payment currencies");
            return Enumerable.Empty<CurrencyDto>();
        }
    }
}

