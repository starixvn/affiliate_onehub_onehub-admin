using System.Net;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ONEHub.Application.LandingPages.AssetUploader.Commands;
using ONEHub.Application.LandingPages.AssetUploader.Queries;
using ONEHub.Domain.Constants;
using ONEHub.Domain.Criterias.LandingPages;
using ONEHub.Domain.DTOs.LandingPages;
using ONEHub.Domain.Interfaces;

namespace ONEHub.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class FormManagementController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ISessionService _sessionService;
    private const string FunctionName = "RegistrationFormUploader";

    public FormManagementController(IMediator mediator, ISessionService sessionService)
    {
        _mediator = mediator;
        _sessionService = sessionService;
    }

    [HttpPost("list")]
    public async Task<IActionResult> GetFormManagementList([FromBody] AssetUploaderRequest request)
    {
        var criteria = new GetAssetUploaderCriteria
        {
            PageIndex = request.PageIndex,
            PageSize = request.PageSize,
            ModuleIds = LandingPageConstants.ModuleIds.RegistrationForm.ToString(),
            TargetCountrycodes = request.TargetCountrycodes,
            LanguageCodes = request.LanguageCodes,
            Status = request.Status,
            MediaId = request.MediaId,
            MediaName = request.MediaName,
            UserId = _sessionService.UserId,
            FunctionName = FunctionName
        };

        var query = new GetAssetListQuery(criteria);
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpPost("detail")]
    public async Task<IActionResult> GetFormDetail([FromBody] AssetDetailRequest request)
    {
        var criteria = new GetAssetDetailCriteria
        {
            MediaId = request.MediaId,
            UserId = _sessionService.UserId
        };

        var query = new GetAssetDetailQuery(criteria);
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpPost("upload")]
    [Authorize(Policy = "IsHost")]
    [RequestSizeLimit(100_000_000)]
    [RequestFormLimits(MultipartBodyLengthLimit = 100_000_000)]
    public async Task<IActionResult> UploadForms([FromForm] UploadAssetsRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var files = Request.Form.Files;
        if (files == null || files.Count == 0)
        {
            return BadRequest("Please select valid files to upload.");
        }

        var command = new UploadAssetsCommand(
            Files: files,
            ModuleId: LandingPageConstants.ModuleIds.RegistrationForm,
            TargetCountryCode: WebUtility.HtmlEncode(request.TargetCountryCode),
            LanguageCode: WebUtility.HtmlEncode(request.LanguageCode),
            InputFileNames: WebUtility.HtmlEncode(request.InputFileNames),
            InputMediaNames: WebUtility.HtmlEncode(request.InputMediaNames),
            UserId: _sessionService.UserId,
            Ip: HttpContext.Connection.RemoteIpAddress?.ToString() ?? string.Empty,
            FunctionName: Functions.RegistrationFormUploader
        );

        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPost("update")]
    [Authorize(Policy = "IsHost")]
    [RequestSizeLimit(100_000_000)]
    [RequestFormLimits(MultipartBodyLengthLimit = 100_000_000)]
    public async Task<IActionResult> UpdateForm([FromForm] UpdateAssetRequest request)
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
            ModuleId: LandingPageConstants.ModuleIds.RegistrationForm,
            TargetCountryCode: WebUtility.HtmlEncode(request.TargetCountryCode),
            LanguageCode: WebUtility.HtmlEncode(request.LanguageCode),
            InputFileName: WebUtility.HtmlEncode(request.InputFileNames),
            InputMediaName: WebUtility.HtmlEncode(request.InputMediaNames),
            UserId: _sessionService.UserId,
            Ip: HttpContext.Connection.RemoteIpAddress?.ToString() ?? string.Empty,
            FunctionName: Functions.RegistrationFormUploader
        );

        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPost("delete")]
    [Authorize(Policy = "IsHost")]
    public async Task<IActionResult> DeleteForms([FromBody] DeleteAssetsRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var command = new DeleteAssetsCommand(
            MediaIds: request.MediaIds,
            UserId: _sessionService.UserId,
            Ip: HttpContext.Connection.RemoteIpAddress?.ToString() ?? string.Empty,
            FunctionName: Functions.RegistrationFormUploader
        );

        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPost("status")]
    [Authorize(Policy = "IsHost")]
    public async Task<IActionResult> ToggleFormStatus([FromBody] UpdateAssetsStatusRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var command = new ToggleAssetStatusCommand(
            MediaIds: request.MediaIds,
            StatusId: request.StatusId,
            UserId: _sessionService.UserId,
            Ip: HttpContext.Connection.RemoteIpAddress?.ToString() ?? string.Empty,
            FunctionName: Functions.RegistrationFormUploader
        );

        var result = await _mediator.Send(command);
        return Ok(result);
    }
}
