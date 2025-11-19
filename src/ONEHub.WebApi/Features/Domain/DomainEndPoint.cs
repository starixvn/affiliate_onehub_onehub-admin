using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;
using MiniValidation;
using ONEHub.Application.Features.Domain.Queries;
using ONEHub.Domain.Entities;
using ONEHub.Domain.Results;

namespace ONEHub.WebApi.Features.Domain;

public static class DomainEndPoint
{
    public static IEndpointRouteBuilder RegisterDomainEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var groupEndpoint = endpoints.MapGroup("/api/domain").RequireAuthorization();

        groupEndpoint.MapGet("/", GetList);

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
}

