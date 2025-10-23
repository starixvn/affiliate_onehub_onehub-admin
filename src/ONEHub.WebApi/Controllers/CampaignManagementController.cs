using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ONEHub.Application.Campaigns.Commands;
using ONEHub.Application.Campaigns.Queries;
using ONEHub.Domain.DTOs.Campaigns;
using ONEHub.Domain.Interfaces;

namespace ONEHub.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CampaignManagementController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ISessionService _sessionService;

    public CampaignManagementController(
        IMediator mediator,
        ISessionService sessionService)
    {
        _mediator = mediator;
        _sessionService = sessionService;
    }

    [HttpPost("GetDashboard")]
    public async Task<IActionResult> GetDashboard()
    {
        var query = new GetCampaignDashboardQuery();
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpPost("GetAllCampaignStatus")]
    public async Task<IActionResult> GetAllCampaignStatus()
    {
        var query = new GetAllCampaignStatusQuery();
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpPost("GetCampaignList")]
    public async Task<IActionResult> GetCampaignList([FromBody] GetCampaignListRequest request)
    {
        var query = new GetCampaignListQuery(
            request.Search,
            request.StatusIds,
            request.Description,
            request.PageIndex,
            request.PageSize,
            request.IsExportExcel
        );

        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpPost("UpdateCampaign")]
    public async Task<IActionResult> UpdateCampaign([FromBody] UpdateCampaignRequest request)
    {
        var command = new UpdateCampaignCommand(
            request.CampaignId,
            request.CampaignName,
            request.Description,
            request.StatusId,
            _sessionService.UserId,
            HttpContext.Connection.RemoteIpAddress?.ToString() ?? string.Empty
        );

        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPost("InsertCampaign")]
    public async Task<IActionResult> InsertCampaign([FromBody] InsertCampaignRequest request)
    {
        var command = new InsertCampaignCommand(
            request.CampaignName,
            request.Description,
            request.StatusId,
            _sessionService.UserId,
            HttpContext.Connection.RemoteIpAddress?.ToString() ?? string.Empty
        );

        var result = await _mediator.Send(command);
        return Ok(result);
    }
}
