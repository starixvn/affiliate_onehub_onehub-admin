using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using MiniValidation;
using ONEHub.Application.Features.LandingPages.AssetUploader;
using ONEHub.Application.Features.LandingPages.AssetUploader.Commands;
using ONEHub.Application.Features.LandingPages.AssetUploader.Queries;
using ONEHub.Domain.Entities;
using ONEHub.Domain.Errors;
using ONEHub.Domain.Params;
using ONEHub.Domain.Results;

namespace ONEHub.WebApi.Features.AssetUploader;

public static class AssetUploaderEndpoint
{
    public static IEndpointRouteBuilder RegisterAssetUploaderEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var groupEndpoint = endpoints.MapGroup("/api/asset-uploader").RequireAuthorization();

        groupEndpoint.MapGet("/filters", GetFilters);
        groupEndpoint.MapPost("/list", GetList);
        groupEndpoint.MapPost("/detail", GetDetail);
        groupEndpoint.MapPost("/upload", UploadAssets)
            .Accepts<IFormFileCollection>("multipart/form-data")
            .WithMetadata(new RequestSizeLimitAttribute(100_000_000))
            .WithMetadata(new RequestFormLimitsAttribute { MultipartBodyLengthLimit = 100_000_000 })
            .DisableAntiforgery();
        
        groupEndpoint.MapPost("/update", UpdateAsset)
            .Accepts<IFormFile>("multipart/form-data")
            .WithMetadata(new RequestSizeLimitAttribute(100_000_000))
            .WithMetadata(new RequestFormLimitsAttribute { MultipartBodyLengthLimit = 100_000_000 })
            .DisableAntiforgery();
        groupEndpoint.MapPost("/status", UpdateAssetStatus);
        groupEndpoint.MapDelete("/delete/{mediaIds}", DeleteAssets);

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
        IMediator mediator)
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
            PageSize = request.PageSize
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
        IFormFileCollection? files,
        IMediator mediator)
    {
        if (!MiniValidator.TryValidate(request, out var errors))
        {
            return TypedResults.ValidationProblem(errors);
        }

        if (files is null || files.Count == 0)
        {
            return TypedResults.Ok(Result.Failure(Error.SystemError with
            {
                Message = "No files uploaded"
            }));
        }

        var moduleRows = request.ModuleRows
            .Select(moduleId => new ModuleRow
            {
                ModuleId = moduleId,
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
        string mediaIds,
        IMediator mediator)
    {
        var command = new DeleteAssetsCommand
        {
            MediaIds = mediaIds
        };

        var result = await mediator.Send(command);

        return TypedResults.Ok(result);
    }
}
