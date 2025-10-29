using System.Net;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ONEHub.Application.Features.LandingPages.AssetUploader.Commands;
using ONEHub.Application.Features.LandingPages.AssetUploader.Queries;
using ONEHub.Domain.Criterias.LandingPages;
using ONEHub.Domain.DTOs.LandingPages;
using ONEHub.Domain.Interfaces;

namespace ONEHub.WebApi.Controllers;

[ApiController]
[Route("api/assetuploader")]
[Authorize]
public class AssetUploaderController(
    IMediator mediator,
    ISessionService sessionService)
    : ControllerBase
{
    private const string FunctionName = "AssetUploader";

    [HttpPost("list")]
    public async Task<IActionResult> GetAssetList([FromBody] AssetUploaderRequest request)
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
            UserId = sessionService.UserId,
            FunctionName = FunctionName
        };

        var query = new GetAssetListQuery(criteria);
        var result = await mediator.Send(query);
        return Ok(result);
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
    [Authorize(Policy = "IsHost")]
    [RequestSizeLimit(100_000_000)]
    [RequestFormLimits(MultipartBodyLengthLimit = 100_000_000)]
    public async Task<IActionResult> UploadAssets([FromForm] UploadAssetsRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var files = Request.Form.Files;
        if (files.Count == 0)
        {
            return BadRequest("Please select valid files to upload.");
        }

        var command = new UploadAssetsCommand(
            Files: files,
            ModuleId: request.ModuleId,
            TargetCountryCode: WebUtility.HtmlEncode(request.TargetCountryCode),
            LanguageCode: WebUtility.HtmlEncode(request.LanguageCode),
            InputFileNames: WebUtility.HtmlEncode(request.InputFileNames),
            InputMediaNames: WebUtility.HtmlEncode(request.InputMediaNames),
            UserId: sessionService.UserId,
            Ip: HttpContext.Connection.RemoteIpAddress?.ToString() ?? string.Empty,
            FunctionName: FunctionName
        );

        var result = await mediator.Send(command);
        return Ok(result);
    }

    [HttpPost("update")]
    [Authorize(Policy = "IsHost")]
    [RequestSizeLimit(100_000_000)]
    [RequestFormLimits(MultipartBodyLengthLimit = 100_000_000)]
    public async Task<IActionResult> UpdateAsset([FromForm] UpdateAssetRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var file = Request.Form.Files.FirstOrDefault();
        if (string.IsNullOrEmpty(request.InputFileNames) && file == null)
        {
            return BadRequest("Please select valid file to update.");
        }

        var command = new UpdateAssetCommand(
            File: file,
            MediaId: request.MediaId,
            ModuleId: request.ModuleId,
            TargetCountryCode: WebUtility.HtmlEncode(request.TargetCountryCode),
            LanguageCode: WebUtility.HtmlEncode(request.LanguageCode),
            InputFileName: WebUtility.HtmlEncode(request.InputFileNames),
            InputMediaName: WebUtility.HtmlEncode(request.InputMediaNames),
            UserId: sessionService.UserId,
            Ip: HttpContext.Connection.RemoteIpAddress?.ToString() ?? string.Empty,
            FunctionName: FunctionName
        );

        var result = await mediator.Send(command);
        return Ok(result);
    }

    [HttpPost("delete")]
    [Authorize(Policy = "IsHost")]
    public async Task<IActionResult> DeleteAssets([FromBody] DeleteAssetsRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var command = new DeleteAssetsCommand(
            MediaIds: request.MediaIds,
            UserId: sessionService.UserId,
            Ip: HttpContext.Connection.RemoteIpAddress?.ToString() ?? string.Empty,
            FunctionName: FunctionName
        );

        var result = await mediator.Send(command);
        return Ok(result);
    }

    [HttpPost("status")]
    [Authorize(Policy = "IsHost")]
    public async Task<IActionResult> ToggleAssetStatus([FromBody] UpdateAssetsStatusRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var command = new ToggleAssetStatusCommand(
            MediaIds: request.MediaIds,
            StatusId: request.StatusId,
            UserId: sessionService.UserId,
            Ip: HttpContext.Connection.RemoteIpAddress?.ToString() ?? string.Empty,
            FunctionName: FunctionName
        );

        var result = await mediator.Send(command);
        return Ok(result);
    }
}

