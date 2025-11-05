using System.Net;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ONEHub.Application.Features.LandingPages.AssetUploader.Commands;
using ONEHub.Application.Features.LandingPages.AssetUploader.Queries;
using ONEHub.Domain.Criterias.LandingPages;
using ONEHub.Domain.DTOs.LandingPages;
using ONEHub.Domain.Entities.LandingPages;
using ONEHub.Domain.Interfaces;
using ONEHub.WebApi.Models;

namespace ONEHub.WebApi.Controllers;

[ApiController]
[Route("api/asset-uploader")]
[Authorize]
public class AssetUploaderController(
    IMediator mediator,
    ISessionService sessionService)
    : ControllerBase
{
    private const string FUNCTION_NAME = "AssetUploader";

    [HttpPost("list")]
    public async Task<ActionResult<IApiResponse<PagingResponse<AssetDetail>>>> GetAssetList(AssetUploaderRequest request)
    {
        var criteria = new GetAssetUploaderCriteria
        {
            PageIndex = request.PageIndex,
            PageSize = request.PageSize,
            ModuleIds = request.ModuleIds,
            TargetCountrycodes = request.TargetCountrycodes,
            LanguageCodes = request.LanguageCodes,
            Status = request.Status,
            MediaId = request.MediaId,
            MediaName = request.MediaName,
            UserId = 1_000_000_008,
            FunctionName = FUNCTION_NAME
        };

        var query = new GetAssetListQuery(criteria);
        var result = await mediator.Send(query);

        var pagingResponse = new PagingResponse<AssetDetail>
        {
            Items = result.MainData,
            TotalCount = result.TotalItem,
            PageIndex = request.PageIndex,
            PageSize = request.PageSize
        };

        return Ok(ApiResponse<PagingResponse<AssetDetail>>.Success(pagingResponse));
    }

    [HttpPost("detail")]
    public async Task<IActionResult> GetAssetDetail([FromBody] AssetDetailRequest request)
    {
        var criteria = new GetAssetDetailCriteria
        {
            MediaId = request.MediaId,
            UserId = sessionService.UserId
        };

        var query = new GetAssetDetailQuery(criteria);
        var result = await mediator.Send(query);
        return Ok(result);
    }

    [HttpPost("upload")]
    [RequestSizeLimit(100_000_000)]
    [RequestFormLimits(MultipartBodyLengthLimit = 100_000_000)]
    public async Task<ActionResult<IApiResponse>> UploadAssets([FromForm] UploadAssetsRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var command = new UploadAssetsCommand(
            request.ModuleRows,
            WebUtility.HtmlEncode(request.TargetCountryCode),
            WebUtility.HtmlEncode(request.LanguageCode),
            1_000_000_008,
            HttpContext.Connection.RemoteIpAddress?.ToString() ?? string.Empty,
            FUNCTION_NAME
        );

        var result = await mediator.Send(command);
        if (!result.IsSuccessful)
        {
            return Ok(ApiResponse.Error(result.Code, result.Message));
        }

        return Ok(ApiResponse.Success());
    }

    [HttpPost("update")]
    [RequestSizeLimit(100_000_000)]
    [RequestFormLimits(MultipartBodyLengthLimit = 100_000_000)]
    public async Task<ActionResult<IApiResponse>> UpdateAsset([FromForm] UpdateAssetRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (string.IsNullOrEmpty(request.InputFileName) && request.File == null)
        {
            return BadRequest("Please select valid file to update.");
        }

        var command = new UpdateAssetCommand(
            request.File,
            request.MediaId,
            request.ModuleId,
            WebUtility.HtmlEncode(request.TargetCountryCode),
            WebUtility.HtmlEncode(request.LanguageCode),
            WebUtility.HtmlEncode(request.InputFileName),
            WebUtility.HtmlEncode(request.InputMediaName),
            1_000_000_008,
            HttpContext.Connection.RemoteIpAddress?.ToString() ?? string.Empty,
            FUNCTION_NAME
        );

        var result = await mediator.Send(command);
        if (!result.IsSuccessful)
        {
            return Ok(ApiResponse.Error(result.Code, result.Message));
        }

        return Ok(ApiResponse.Success());
    }

    [HttpDelete("delete/{mediaIds}")]
    public async Task<ActionResult<IApiResponse>> DeleteAssets(string mediaIds)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var command = new DeleteAssetsCommand(
            mediaIds,
            1_000_000_008,
            HttpContext.Connection.RemoteIpAddress?.ToString() ?? string.Empty,
            FUNCTION_NAME
        );

        var result = await mediator.Send(command);
        if (!result.IsSuccessful)
        {
            return Ok(ApiResponse.Error(result.Code, result.Message));
        }

        return Ok(ApiResponse.Success());
    }

    [HttpPost("status")]
    public async Task<ActionResult<IApiResponse>> ToggleAssetStatus([FromBody] UpdateAssetsStatusRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var command = new ToggleAssetStatusCommand(
            request.MediaIds,
            request.StatusId,
            1_000_000_008,
            HttpContext.Connection.RemoteIpAddress?.ToString() ?? string.Empty,
            FUNCTION_NAME
        );

        var result = await mediator.Send(command);
        if (!result.IsSuccessful)
        {
            return Ok(ApiResponse.Error(result.Code, result.Message));
        }

        return Ok(ApiResponse.Success());
    }
}

