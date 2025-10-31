using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ONEHub.Application.DTOs.Components;
using ONEHub.Application.Features.Components.Commands;
using ONEHub.Application.Features.Components.Queries;
using ONEHub.Domain.DTOs.Components;
using ONEHub.Domain.Interfaces;
using ONEHub.WebApi.Models;

namespace ONEHub.WebApi.Controllers;

[ApiController]
[Route("api/component")]
[Authorize]
public class ComponentController(
    IMediator mediator,
    ISessionService sessionService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IApiResponse<IEnumerable<ComponentInfo>>>> Get(
        [FromQuery] GetComponentsByTypeRequest request)
    {
        var query = new GetComponentsByTypeQuery(
            request.ComponentTypeId,
            request.ComponentId
        );

        var result = await mediator.Send(query);
        return Ok(ApiResponse<IEnumerable<ComponentInfo>>.Success(result));
    }

    [HttpPost]
    public async Task<ActionResult<IApiResponse>> InsertComponent([FromBody] InsertComponentRequest request)
    {
        var command = new InsertComponentCommand(
            request.ComponentName,
            request.ComponentCode,
            request.ComponentTypeId,
            request.StatusId,
            sessionService.UserId,
            HttpContext.Connection.RemoteIpAddress?.ToString() ?? string.Empty
        );

        var result = await mediator.Send(command);

        if (!result.IsSuccessful)
        {
            return Ok(ApiResponse.Error(result.Code, result.Message));
        }

        return Ok(ApiResponse.Success());
    }
}

