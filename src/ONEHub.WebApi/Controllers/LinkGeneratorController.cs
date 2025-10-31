using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ONEHub.Application.DTOs.LinkGenerator;
using ONEHub.Application.Features.LinkGenerator.Queries;
using ONEHub.WebApi.Models;

namespace ONEHub.WebApi.Controllers;

[ApiController]
[Route("api/link-generator")]
[Authorize]
public class LinkGeneratorController(IMediator mediator) : ControllerBase
{
    [HttpGet("form-options")]
    public async Task<ActionResult<IApiResponse<LinkGeneratorFormOptionsDto>>> GetFormOptions()
    {
        var query = new GetLinkGeneratorFormOptionsQuery();
        var result = await mediator.Send(query);
        return Ok(ApiResponse<LinkGeneratorFormOptionsDto>.Success(result));
    }
}

