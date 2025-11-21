namespace ONEHub.WebApi.Features.LandingPage.AssetUploader;

public static class AssetUploaderEndpoint
{
    private const string FUNCTION_NAME = "[AssetUploader]";

    public static IEndpointRouteBuilder RegisterAssetUploaderEndpoints(this IEndpointRouteBuilder endpoints)
    {
        return BaseMediaEndpoint.RegisterMediaEndpoints(
            endpoints,
            routePrefix: "/api/asset-uploader",
            tagName: "AssetUploaderEndpoint",
            functionName: FUNCTION_NAME);
    }
}
