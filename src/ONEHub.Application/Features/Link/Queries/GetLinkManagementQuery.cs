using MediatR;
using ONEHub.Application.Features.Shared;
using ONEHub.Domain.Entities;
using ONEHub.Domain.Params;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Features.Link.Queries;

public class GetLinkManagementQuery : BaseQuery<LinkManagement>
{
    public string? Search { get; set; } = string.Empty;

    public string? StatusIds { get; set; } = string.Empty;

    public string? CountryCodes { get; set; } = string.Empty;

    public string? ChannelIds { get; set; } = string.Empty;

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    public bool IsExportExcel { get; set; }

    public int PageIndex { get; set; } = 1;

    public int PageSize { get; set; } = 20;
}

public record LinkResponse(
    int LinkId,
    string LinkName,
    string DomainName,
    string ShortLink,
    string FullLink,
    string Event,
    string LandingPage,
    string Group,
    string CampaignName,
    string ChannelName,
    string CountryName,
    string Agency,
    string Language,
    string Type,
    string Note,
    string IDCode,
    string CreatedDate,
    int Click,
    int Registration,
    int Bonus,
    int Ftd,
    decimal AvgFtdAmount,
    int StatusId,
    string StatusName,
    int RowIdx);

public class GetLinkManagementHandler(ILinkRepository linkRepository)
    : IRequestHandler<GetLinkManagementQuery, Result<LinkManagement>>
{
    public async Task<Result<LinkManagement>> Handle(GetLinkManagementQuery request, CancellationToken cancellationToken)
    {
        var param = new LinkManagementParam
        {
            Search = request.Search,
            StatusIds = request.StatusIds,
            CountryCodes = request.CountryCodes,
            ChannelIds = request.ChannelIds,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            PageIndex = request.PageIndex,
            PageSize = request.PageSize,
            IsExportExcel = request.IsExportExcel
        };

        var linkListResult = await linkRepository.GetLinkManagementDataAsync(param);

        return linkListResult;
    }
}

