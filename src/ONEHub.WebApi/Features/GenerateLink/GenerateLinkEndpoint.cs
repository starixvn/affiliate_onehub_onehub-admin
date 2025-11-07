namespace ONEHub.WebApi.Features.GenerateLink;

public static class GenerateLinkEndpoint
{
    public static IEndpointRouteBuilder RegisterGenerateLinkEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var groupEndpoint = endpoints.MapGroup("/api/generate-link").RequireAuthorization();

        return groupEndpoint;
    }
}

