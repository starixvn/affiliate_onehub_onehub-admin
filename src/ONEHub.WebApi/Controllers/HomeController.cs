using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ONEHub.Application.DTOs.Home;
using ONEHub.Application.Home.Queries;
using ONEHub.Domain.Common;

namespace ONEHub.WebApi.Controllers;

[ApiController]
[Route("api/home")]
[Authorize]
public class HomeController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<HomeController> _logger;

    public HomeController(IMediator mediator, ILogger<HomeController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    [HttpGet("general-info")]
    public async Task<ActionResult<GeneralInfoDto>> GetGeneralInfo()
    {
        try
        {
            var query = new GetGeneralInfoQuery();
            var result = await _mediator.Send(query);

            if (result == null)
            {
                return NotFound(new { Message = "General info not found" });
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting general info");
            return StatusCode(500, new { Message = "An error occurred" });
        }
    }

    [HttpPost("online-list")]
    public async Task<ActionResult<EntityResult<OnlineListInfoDto>>> GetOnlineList([FromBody] OnlineListRequest request)
    {
        try
        {
            var query = new GetOnlineListQuery(request.PageIndex, request.PageSize);
            var result = await _mediator.Send(query);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting online list, PageIndex: {PageIndex}, PageSize: {PageSize}",
                request.PageIndex, request.PageSize);
            return StatusCode(500, new { Message = "An error occurred" });
        }
    }
}

public record OnlineListRequest(int PageIndex = 1, int PageSize = 20);
