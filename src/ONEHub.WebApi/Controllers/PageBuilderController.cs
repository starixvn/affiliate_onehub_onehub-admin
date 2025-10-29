using System.Net;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ONEHub.Application.Features.LandingPages.LandingPageService.Queries;
using ONEHub.Application.Features.LandingPages.PageBuilder.Commands;
using ONEHub.Application.Features.LandingPages.PageBuilder.Queries;
using ONEHub.Domain.Criterias.LandingPages;
using ONEHub.Domain.DTOs.Campaigns;
using ONEHub.Domain.DTOs.LandingPages;
using ONEHub.Domain.Entities.LandingPages;
using ONEHub.Domain.Interfaces;
using InsertCampaignDomainCommand = ONEHub.Domain.Commands.Campaigns.InsertCampaignCommand;

namespace ONEHub.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PageBuilderController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ISessionService _sessionService;
    private readonly IConfiguration _configuration;

    public PageBuilderController(
        IMediator mediator,
        ISessionService sessionService,
        IConfiguration configuration)
    {
        _mediator = mediator;
        _sessionService = sessionService;
        _configuration = configuration;
    }

    [HttpGet("detail")]
    public async Task<IActionResult> GetPageBuilderDetail([FromQuery] int pageId)
    {
        if (pageId <= 0)
        {
            return BadRequest(new { error = "Invalid page ID" });
        }

        var query = new GetPageBuilderDetailQuery(pageId);
        var result = await _mediator.Send(query);

        if (result == null)
        {
            return NotFound(new { error = "Page not found" });
        }

        return Ok(result);
    }

    [HttpPost("GetMediaSources")]
    public async Task<IActionResult> GetMediaSources([FromBody] MediaSourceRequest request)
    {
        var criteria = new GetMediaSourceCriteria
        {
            ModuleId = request.ModuleId,
            TargetCountryCode = request.TargetCountryCode,
            LanguageCode = request.LanguageCode
        };

        var query = new GetMediaSourcesQuery(criteria);
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpPost("GetNormalDealList")]
    public async Task<IActionResult> GetNormalDealList()
    {
        var query = new GetNormalDealListQuery();
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpPost("GetCampaignInfoList")]
    public async Task<IActionResult> GetCampaignInfoList()
    {
        var query = new GetCampaignInfoListQuery();
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpPost("GetDealList")]
    public async Task<IActionResult> GetDealList()
    {
        var query = new GetLandingPageDealListQuery();
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpPost("InsertLandingPageDeal")]
    [Authorize(Policy = "IsHost")]
    public async Task<IActionResult> InsertLandingPageDeal([FromBody] InsertLandingPageDealRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var command = new InsertLandingPageDealCommand(
            request.PageId,
            request.CampaignId,
            _sessionService.UserId,
            HttpContext.Connection.RemoteIpAddress?.ToString() ?? string.Empty);

        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPost("InsertLandingPageCampaign")]
    [Authorize(Policy = "AllCampaignsIsHost")]
    public async Task<IActionResult> InsertLandingPageCampaign([FromBody] InsertCampaignRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var domainCommand = new InsertCampaignDomainCommand
        {
            CampaignName = request.CampaignName.Trim(),
            Description = request.Description?.Trim() ?? string.Empty,
            StatusId = request.StatusId,
            UserId = _sessionService.UserId,
            Ip = HttpContext.Connection.RemoteIpAddress?.ToString() ?? string.Empty
        };

        var command = new InsertLandingPageCampaignCommand(domainCommand);
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPost("InsertPageBuilder")]
    [Authorize(Policy = "IsHost")]
    public async Task<IActionResult> InsertPageBuilder([FromBody] PageBuilderRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var moduleComponentsJson = JsonConvert.SerializeObject(EncodeModuleComponents(request.ModuleComponentsSetting));

        var command = new InsertPageBuilderCommand(
            request.PageId,
            request.CampaignId,
            request.PageName.Trim(),
            request.PageCode.Trim(),
            WebUtility.HtmlEncode(request.DealIds),
            request.StatusId,
            WebUtility.HtmlEncode(request.TargetCountryCode),
            WebUtility.HtmlEncode(request.LanguageCode),
            moduleComponentsJson,
            request.IsPreview,
            _sessionService.UserId,
            HttpContext.Connection.RemoteIpAddress?.ToString() ?? string.Empty);

        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPost("UpdatePageBuilder")]
    [Authorize(Policy = "IsHost")]
    public async Task<IActionResult> UpdatePageBuilder([FromBody] PageBuilderRequest request)
    {
        if (!ModelState.IsValid || request.PageId <= 0)
        {
            return BadRequest(ModelState);
        }

        var moduleComponentsJson = JsonConvert.SerializeObject(EncodeModuleComponents(request.ModuleComponentsSetting));

        var command = new UpdatePageBuilderCommand(
            request.PageId,
            request.CampaignId,
            request.PageName.Trim(),
            request.PageCode.Trim(),
            WebUtility.HtmlEncode(request.DealIds),
            request.StatusId,
            WebUtility.HtmlEncode(request.TargetCountryCode),
            WebUtility.HtmlEncode(request.LanguageCode),
            moduleComponentsJson,
            request.IsPreview,
            _sessionService.UserId,
            HttpContext.Connection.RemoteIpAddress?.ToString() ?? string.Empty);

        var result = await _mediator.Send(command);
        return Ok(result);
    }

    private IList<ModuleComponentItem> EncodeModuleComponents(IList<ModuleComponentItem> componentStructure)
    {
        foreach (var item in componentStructure)
        {
            if (!string.IsNullOrEmpty(item.ExtraInfo))
            {
                item.ExtraInfo = WebUtility.HtmlEncode(item.ExtraInfo);
            }
        }

        return componentStructure;
    }
}

