using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ONEHub.Application.Campaigns.Commands;
using ONEHub.Application.Campaigns.Queries;
using ONEHub.Application.DTOs.Campaigns;
using ONEHub.Domain.DTOs.Campaigns;
using ONEHub.Domain.Interfaces;
using ONEHub.WebApi.Models;

namespace ONEHub.WebApi.Controllers;

[ApiController]
[Route("api/campaign-management")]
[Authorize]
public class CampaignManagementController(
    IMediator mediator,
    ISessionService sessionService) : ControllerBase
{
    [HttpGet("summary")]
    public async Task<ActionResult<IApiResponse<CampaignDashboardDto>>> GetDashboard()
    {
        var query = new GetCampaignDashboardQuery();
        var result = await mediator.Send(query);
        var campaignDashboardDto = new CampaignDashboardDto
        {
            Total = result.TotalCampaigns,
            Active = result.ActiveCampaigns,
            Draft = result.DraftCampaigns,
            Inactive = result.InactiveCampaigns,
            Paused = result.PausedCampaigns
        };
        return Ok(ApiResponse<CampaignDashboardDto>.Success(campaignDashboardDto));
    }

    [HttpGet]
    public async Task<ActionResult<IApiResponse<PagingResponse<CampaignDetailInfo>>>> GetCampaignList([FromQuery] GetCampaignListRequest request)
    {
        var query = new GetCampaignListQuery(
            request.Search,
            request.Status,
            request.PageIndex,
            request.PageSize,
            request.IsExportExcel
        );

        var result = await mediator.Send(query);

        var pagingResponse = new PagingResponse<CampaignDetailInfo>
        {
            Items = result.MainData,
            TotalCount = result.TotalItem,
            PageIndex = request.PageIndex,
            PageSize = request.PageSize
        };

        return Ok(ApiResponse<PagingResponse<CampaignDetailInfo>>.Success(pagingResponse));
    }

    [HttpPost]
    public async Task<ActionResult<IApiResponse>> CreateCampaign([FromBody] InsertCampaignRequest request)
    {
        var command = new InsertCampaignCommand(
            request.CampaignName,
            request.Description,
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

    [HttpPut("{id}")]
    public async Task<ActionResult<IApiResponse>> UpdateCampaign(int id, [FromBody] UpdateCampaignRequest request)
    {
        if (id != request.CampaignId)
        {
            return Ok(ApiResponse.Error(-1, "Campaign ID mismatch"));
        }

        var command = new UpdateCampaignCommand(
            request.CampaignId,
            request.CampaignName,
            request.Description,
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

    [HttpDelete("{id}")]
    public async Task<ActionResult<IApiResponse>> DeleteCampaign(int id)
    {
        var command = new DeleteCampaignsCommand(
            [id],
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

    [HttpDelete]
    public async Task<ActionResult<IApiResponse>> DeleteCampaigns([FromBody] DeleteCampaignRequest request)
    {
        var command = new DeleteCampaignsCommand(
            request.CampaignIds,
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
