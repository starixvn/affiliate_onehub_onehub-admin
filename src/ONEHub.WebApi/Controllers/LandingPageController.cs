using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ONEHub.Application.Features.LandingPages.LandingPageService.Queries;
using ONEHub.Application.Features.LandingPages.PageManagement.Commands;
using ONEHub.Application.Features.LandingPages.PageManagement.Queries;
using ONEHub.Domain.Criterias.LandingPages;
using ONEHub.Domain.DTOs.LandingPages;
using ONEHub.Domain.Interfaces;
using DomainCommand = ONEHub.Domain.Commands.LandingPages.UpdateLandingPageStatusCommand;

namespace ONEHub.WebApi.Controllers;

[ApiController]
[Route("api/landingpage")]
[Authorize]
public class LandingPageController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ISessionService _sessionService;
    private readonly IConfiguration _configuration;

    public LandingPageController(
        IMediator mediator,
        ISessionService sessionService,
        IConfiguration configuration)
    {
        _mediator = mediator;
        _sessionService = sessionService;
        _configuration = configuration;
    }

    [HttpGet("filters")]
    public async Task<IActionResult> GetFilters()
    {
        var landingPageUrl = _configuration["AppSettings:LandingPageUrl"] ?? string.Empty;
        var bannerRootUrl = _configuration["AppSettings:BannerRootUrl"] ?? string.Empty;
        var maxFiles = int.Parse(_configuration["AppSettings:MaximumFiles"] ?? "50");
        var maxFileSize = int.Parse(_configuration["AppSettings:MaxFileSize"] ?? "3");
        var allowedExtensions = _configuration["AppSettings:AllowedImageExtensions"]?.Split(',') ?? new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };

        var allLanguages = await _mediator.Send(new GetAllLanguagesInSystemQuery());
        var targetCountries = await _mediator.Send(new GetTargetCountryListQuery());
        var statusList = await _mediator.Send(new GetLandingPageStatusListQuery());
        var campaigns = await _mediator.Send(new GetCampaignInfoListQuery());
        var deals = await _mediator.Send(new GetLandingPageDealListQuery());
        var modules = await _mediator.Send(new GetModuleListQuery());

        return Ok(new
        {
            // Common filters (used by all pages)
            AllLanguagesInSystem = allLanguages,
            TargetCountryList = targetCountries,
            StatusList = statusList,

            // Page Management & Page Builder
            LandingPageUrl = landingPageUrl,
            CampaignList = campaigns,
            DealList = deals,

            // Page Builder & Asset Uploader
            ModuleList = modules,
            BannerRootUrl = bannerRootUrl,

            // Asset Uploader specific
            MaximumFiles = maxFiles,
            MaxFileSize = maxFileSize,
            AllowedExtensions = allowedExtensions
        });
    }

    [HttpPost("list")]
    public async Task<IActionResult> GetPageManagementList([FromBody] PageManagementRequest request)
    {
        var criteria = new GetPageManagementCriteria
        {
            PageIndex = request.PageIndex,
            PageSize = request.PageSize,
            TargetCountryCodes = request.TargetCountryCodes,
            LanguageCodes = request.LanguageCodes,
            DealIds = request.DealIds,
            StatusIds = request.StatusIds,
            LandingPageName = request.LandingPageName,
            CampaignName = request.CampaignName
        };

        var query = new GetPageManagementListQuery(criteria);
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpPost("status")]
    public async Task<IActionResult> ToggleLandingPageStatus([FromBody] UpdateLandingPageStatusRequest request)
    {
        var domainCommand = new DomainCommand
        {
            PageId = request.PageId,
            StatusId = request.StatusId,
            UserId = _sessionService.UserId,
            Ip = HttpContext.Connection.RemoteIpAddress?.ToString() ?? string.Empty
        };

        var command = new ToggleLandingPageStatusCommand(domainCommand);
        var result = await _mediator.Send(command);
        return Ok(result);
    }
}

