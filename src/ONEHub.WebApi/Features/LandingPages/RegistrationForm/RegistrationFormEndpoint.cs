using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace ONEHub.WebApi.Features.LandingPages.RegistrationForm;

public static class RegistrationFormEndpoint
{
    private const string FUNCTION_NAME = "[RegistrationFormUploader]";

    public static IEndpointRouteBuilder RegisterRegistrationFormEndpoint(this IEndpointRouteBuilder endpoints)
    {
        var groupEndpoint = endpoints.MapGroup("/api/registration-form")
            .RequireAuthorization()
            .WithTags("RegistrationFormEndpoint");

        groupEndpoint.MapGet("/filters", BaseMediaEndpoint.GetFilters);
        groupEndpoint.MapPost("/list", (GetAssetListRequest request, IMediator mediator)
            => BaseMediaEndpoint.GetList(request, mediator, FUNCTION_NAME));
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
        groupEndpoint.MapDelete("/delete", BaseMediaEndpoint.DeleteAssets);

        return groupEndpoint;
    }
}
