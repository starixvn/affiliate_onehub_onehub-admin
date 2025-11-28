using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using MiniValidation;
using ONEHub.Application.Features.Domain.Queries;
using ONEHub.Domain.Entities;
using ONEHub.Domain.Errors;
using ONEHub.Domain.Results;

namespace ONEHub.WebApi.Features.Domain;

public static class DomainEndPoint
{
    private static DateTimeOffset _lastRefreshTime = DateTimeOffset.MinValue;
    private static readonly Lock RateLimitLock = new();

    public static IEndpointRouteBuilder RegisterDomainEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var groupEndpoint = endpoints.MapGroup("/api/domain").RequireAuthorization();

        groupEndpoint.MapGet("/", GetList);
        groupEndpoint.MapPost("/refresh", RefreshDomains);

        return groupEndpoint;
    }

    private static async Task<Results<Ok<Result<IEnumerable<DomainInfo>>>, ValidationProblem>> GetList(
        [AsParameters] GetDomainListRequest request,
        IMediator mediator)
    {
        if (!MiniValidator.TryValidate(request, out var errors))
        {
            return TypedResults.ValidationProblem(errors);
        }

        var query = new GetDomainListQuery
        {
            CountryCode = request.CountryCode,
            DomainType = request.DomainType
        };

        var result = await mediator.Send(query);

        return TypedResults.Ok(result);
    }

    private static async Task<Results<Ok<Result>, ValidationProblem, BadRequest<Result>>> RefreshDomains(
        [FromBody] RefreshDomainRequest request,
        IMediator mediator)
    {
        if (!MiniValidator.TryValidate(request, out var errors))
        {
            return TypedResults.ValidationProblem(errors);
        }

        lock (RateLimitLock)
        {
            var timeSinceLastRefresh = DateTimeOffset.UtcNow - _lastRefreshTime;
            if (timeSinceLastRefresh.TotalSeconds < 1)
            {
                return TypedResults.BadRequest(Result.Failure(
                    new Error(429, "Please wait at least 1 second between refresh requests")
                ));
            }
            _lastRefreshTime = DateTimeOffset.UtcNow;
        }

        await Task.Delay(500);

        return TypedResults.Ok(Result.Success());
    }
}
