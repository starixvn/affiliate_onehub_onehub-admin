namespace ONEHub.WebApi.Features.LandingPage.RegistrationForm;

public static class RegistrationFormEndpoint
{
    private const string FUNCTION_NAME = "[RegistrationFormUploader]";

    public static IEndpointRouteBuilder RegisterRegistrationFormEndpoint(this IEndpointRouteBuilder endpoints)
    {
        return BaseMediaEndpoint.RegisterMediaEndpoints(
            endpoints,
            routePrefix: "/api/registration-form",
            tagName: "RegistrationFormEndpoint",
            functionName: FUNCTION_NAME);
    }
}
