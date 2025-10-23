using MediatR;
using Microsoft.AspNetCore.Mvc;
using ONEHub.Application.Affiliates.Commands;
using ONEHub.Application.Affiliates.Queries;

namespace ONEHub.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AffiliatesController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<AffiliatesController> _logger;

    public AffiliatesController(IMediator mediator, ILogger<AffiliatesController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetAffiliateList([FromQuery] GetAffiliateListQuery query)
    {
        _logger.LogInformation("Getting affiliate list");
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("{affiliateId}")]
    public async Task<IActionResult> GetAffiliateBasicInfo(int affiliateId)
    {
        _logger.LogInformation("Getting affiliate basic info for ID: {AffiliateId}", affiliateId);
        var query = new GetAffiliateBasicInfoQuery { AffiliateId = affiliateId };
        var result = await _mediator.Send(query);

        if (result == null)
            return NotFound();

        return Ok(result);
    }

    [HttpPost("{affiliateId}/approve")]
    public async Task<IActionResult> ApproveAffiliate(int affiliateId, [FromBody] ApproveAffiliateCommand command)
    {
        _logger.LogInformation("Approving affiliate ID: {AffiliateId}", affiliateId);
        command.AffiliateId = affiliateId;
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPost("{affiliateId}/change-password")]
    public async Task<IActionResult> ChangePassword(int affiliateId, [FromBody] ChangeAffiliatePasswordCommand command)
    {
        _logger.LogInformation("Changing password for affiliate ID: {AffiliateId}", affiliateId);
        command.AffiliateId = affiliateId;
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPost("{affiliateId}/favorite")]
    public async Task<IActionResult> ToggleFavorite(int affiliateId, [FromBody] ToggleAffiliateFavoriteCommand command)
    {
        _logger.LogInformation("Toggling favorite for affiliate ID: {AffiliateId}", affiliateId);
        command.AffiliateId = affiliateId;
        var result = await _mediator.Send(command);
        return Ok(result);
    }
}

