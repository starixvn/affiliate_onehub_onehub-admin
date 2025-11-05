using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ONEHub.Application.DTOs.LinkGenerator;
using ONEHub.Application.Features.LinkGenerator.Queries;
using ONEHub.Domain.DTOs.Components;
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

    [HttpGet("languages/{countryCode}")]
    public async Task<ActionResult<IApiResponse<IEnumerable<TargetCountry>>>> GetLanguagesByCountry(string countryCode)
    {
        var query = new GetLanguagesByCountryQuery(countryCode);
        var result = await mediator.Send(query);
        return Ok(ApiResponse<IEnumerable<TargetCountry>>.Success(result));
    }
}

