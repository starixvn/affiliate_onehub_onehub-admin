using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using MiniValidation;
using ONEHub.Application.Features.LandingPages.BaseMedia.Commands;
using ONEHub.Application.Features.LandingPages.BaseMedia.Queries;
using ONEHub.Domain.Entities;
using ONEHub.Domain.Params;
using ONEHub.Domain.Results;

namespace ONEHub.WebApi.Features.LandingPage;

internal static class BaseMediaEndpoint
{
    internal static RouteGroupBuilder RegisterMediaEndpoints(
        IEndpointRouteBuilder endpoints,
        string routePrefix,
        string tagName,
        string functionName)
    {
        const int MaxRequestSize = ONEHub.Domain.Constants.LandingPages.FileUpload.MaxRequestSizeBytes;

        var groupEndpoint = endpoints.MapGroup(routePrefix)
            .RequireAuthorization()
            .WithTags(tagName);

        groupEndpoint.MapGet("/filters", GetFilters);
        groupEndpoint.MapPost("/list", (GetAssetListRequest request, IMediator mediator)
            => GetList(request, mediator, functionName));
        groupEndpoint.MapPost("/detail", GetDetail);
        groupEndpoint.MapPost("/upload", UploadAssets)
            .Accepts<IFormFileCollection>("multipart/form-data")
            .WithMetadata(new RequestSizeLimitAttribute(MaxRequestSize))
            .WithMetadata(new RequestFormLimitsAttribute { MultipartBodyLengthLimit = MaxRequestSize })
            .DisableAntiforgery();

        groupEndpoint.MapPost("/update", UpdateAsset)
            .Accepts<IFormFile>("multipart/form-data")
            .WithMetadata(new RequestSizeLimitAttribute(MaxRequestSize))
            .WithMetadata(new RequestFormLimitsAttribute { MultipartBodyLengthLimit = MaxRequestSize })
            .DisableAntiforgery();
        groupEndpoint.MapPost("/status", UpdateAssetStatus);
        groupEndpoint.MapDelete("/delete", DeleteAssets);

        return groupEndpoint;
    }

    private static async Task<Ok<Result<FiltersResponse>>> GetFilters(IMediator mediator)
    {
        var query = new GetFiltersQuery();

        var result = await mediator.Send(query);
        return TypedResults.Ok(result);
    }

    private static async Task<Results<Ok<Result<PagingData<AssetDetail>>>, ValidationProblem>> GetList(
        [FromBody] GetAssetListRequest request,
        IMediator mediator,
        string functionName)
    {
        if (!MiniValidator.TryValidate(request, out var errors))
        {
            return TypedResults.ValidationProblem(errors);
        }

        var query = new GetAssetListQuery
        {
            MediaName = request.MediaName,
            ModuleIds = request.ModuleIds,
            TargetCountryCodes = request.TargetCountryCodes,
            LanguageCodes = request.LanguageCodes,
            Status = request.Status,
            PageIndex = request.PageIndex,
            PageSize = request.PageSize,
            FunctionName = functionName
        };

        var result = await mediator.Send(query);

        return TypedResults.Ok(result);
    }

    private static async Task<Results<Ok<Result<AssetDetail>>, ValidationProblem>> GetDetail(
        [FromBody] GetAssetDetailRequest request,
        IMediator mediator)
    {
        if (!MiniValidator.TryValidate(request, out var errors))
        {
            return TypedResults.ValidationProblem(errors);
        }

        var query = new GetAssetDetailQuery
        {
            MediaId = request.MediaId
        };

        var result = await mediator.Send(query);

        return TypedResults.Ok(result);
    }

    private static async Task<Results<Ok<Result>, ValidationProblem>> UploadAssets(
        [FromForm] UploadAssetsRequest request,
        IFormFileCollection files,
        IMediator mediator)
    {
        if (!MiniValidator.TryValidate(request, out var errors))
        {
            return TypedResults.ValidationProblem(errors);
        }

        if (request.ModuleRows.Count == 0)
        {
            return TypedResults.ValidationProblem(new Dictionary<string, string[]>
            {
                ["moduleRows"] = ["At least one module is required."]
            });
        }

        if (files.Count == 0)
        {
            return TypedResults.ValidationProblem(new Dictionary<string, string[]>
            {
                ["files"] = ["No files uploaded"]
            });
        }

        var moduleRows = request.ModuleRows
            .Select((moduleId, index) => new ModuleRow
            {
                ModuleId = moduleId,
                InputMediaNames = request.InputMediaNames != null && index < request.InputMediaNames.Count
                    ? request.InputMediaNames[index]
                    : null,
                Files = files
                    .Where(f => f.Name.Equals(moduleId.ToString(), StringComparison.OrdinalIgnoreCase))
                    .ToList()
            })
            .ToList();

        var command = new UploadAssetsCommand
        {
            ModuleRows = moduleRows,
            TargetCountryCode = request.TargetCountryCode,
            LanguageCode = request.LanguageCode
        };

        var result = await mediator.Send(command);
        return TypedResults.Ok(result);
    }

    private static async Task<Results<Ok<Result>, ValidationProblem>> UpdateAsset(
        [FromForm] UpdateAssetRequest request,
        IFormFile? file,
        IMediator mediator)
    {
        if (!MiniValidator.TryValidate(request, out var errors))
        {
            return TypedResults.ValidationProblem(errors);
        }

        var command = new UpdateAssetCommand
        {
            File = file,
            MediaId = request.MediaId,
            ModuleId = request.ModuleId,
            TargetCountryCode = request.TargetCountryCode,
            LanguageCode = request.LanguageCode,
            InputFileName = request.InputFileName,
            InputMediaName = request.InputMediaName
        };

        var result = await mediator.Send(command);

        return TypedResults.Ok(result);
    }

    private static async Task<Results<Ok<Result>, ValidationProblem>> UpdateAssetStatus(
        [FromBody] UpdateAssetStatusRequest request,
        IMediator mediator)
    {
        if (!MiniValidator.TryValidate(request, out var errors))
        {
            return TypedResults.ValidationProblem(errors);
        }

        var command = new ToggleAssetStatusCommand
        {
            MediaIds = request.MediaIds,
            StatusId = request.StatusId
        };

        var result = await mediator.Send(command);

        return TypedResults.Ok(result);
    }

    private static async Task<Results<Ok<Result>, ValidationProblem>> DeleteAssets(
        [FromBody] DeleteAssetRequest request,
        IMediator mediator)
    {
        if (!MiniValidator.TryValidate(request, out var errors))
        {
            return TypedResults.ValidationProblem(errors);
        }

        var command = new DeleteAssetsCommand
        {
            MediaIds = request.MediaIds
        };

        var result = await mediator.Send(command);

        return TypedResults.Ok(result);
    }
}
