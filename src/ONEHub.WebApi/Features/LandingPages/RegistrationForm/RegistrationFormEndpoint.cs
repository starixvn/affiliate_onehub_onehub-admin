using Microsoft.AspNetCore.Mvc;

namespace ONEHub.WebApi.Features.LandingPages.RegistrationForm;

public static class RegistrationFormEndpoint
{
    public static IEndpointRouteBuilder RegisterRegistrationFormEndpoint(this IEndpointRouteBuilder endpoints)
    {
        var groupEndpoint = endpoints.MapGroup("/api/registration-form").RequireAuthorization();

        groupEndpoint.MapGet("/filters", BaseMediaEndpoint.GetFilters);
        groupEndpoint.MapPost("/list", BaseMediaEndpoint.GetList);
        groupEndpoint.MapPost("/detail", BaseMediaEndpoint.GetDetail);
        groupEndpoint.MapPost("/upload", BaseMediaEndpoint.UploadAssets)
            .Accepts<IFormFileCollection>("multipart/form-data")
            .WithMetadata(new RequestSizeLimitAttribute(100_000_000))
            .WithMetadata(new RequestFormLimitsAttribute { MultipartBodyLengthLimit = 100_000_000 })
            .DisableAntiforgery();

        groupEndpoint.MapPost("/update", BaseMediaEndpoint.UpdateAsset)
            .Accepts<IFormFile>("multipart/form-data")
            .WithMetadata(new RequestSizeLimitAttribute(100_000_000))
            .WithMetadata(new RequestFormLimitsAttribute { MultipartBodyLengthLimit = 100_000_000 })
            .DisableAntiforgery();
        groupEndpoint.MapPost("/status", BaseMediaEndpoint.UpdateAssetStatus);
        groupEndpoint.MapDelete("/delete/{mediaIds}", BaseMediaEndpoint.DeleteAssets);

        return groupEndpoint;
    }
}
