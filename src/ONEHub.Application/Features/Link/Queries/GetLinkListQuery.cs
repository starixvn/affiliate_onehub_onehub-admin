using MediatR;
using ONEHub.Application.Features.Shared;
using ONEHub.Application.Utils;
using ONEHub.Domain.Entities;
using ONEHub.Domain.Errors;
using ONEHub.Domain.Params;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Features.Link.Queries;

public class GetLinkListQuery : PagingQuery<LinkResponse>
{
    public string? Search { get; set; } = string.Empty;

    public string? StatusIds { get; set; } = string.Empty;

    public string? CountryCodes { get; set; } = string.Empty;

    public string? ChannelIds { get; set; } = string.Empty;

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    public bool IsExportExcel { get; set; }
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

public class GetLinkListHandler(ILinkRepository linkRepository)
    : IRequestHandler<GetLinkListQuery, Result<PagingData<LinkResponse>>>
{
    public async Task<Result<PagingData<LinkResponse>>> Handle(GetLinkListQuery request, CancellationToken cancellationToken)
    {
        var param = new LinkListParam
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

        var linkListResult = await linkRepository.GetLinkListAsync(param);

        if (linkListResult.IsFailure)
        {
            return Result<PagingData<LinkResponse>>.Failure(linkListResult.Error);
        }

        if (linkListResult.Data is null)
        {
            return Result<PagingData<LinkResponse>>.Failure(Error.NoData);
        }

        var result = new PagingData<LinkResponse>
        {
            Items = linkListResult.Data.Items.Select(link => new LinkResponse(
                link.LinkId,
                link.LinkName,
                link.DomainName,
                link.ShortLink,
                link.FullLink,
                link.Event,
                link.LandingPage,
                link.Group,
                link.CampaignName,
                link.ChannelName,
                link.CountryName,
                link.Agency,
                link.Language,
                link.Type,
                link.Note,
                link.IDCode,
                DateTimeUtils.FormatDateString(link.CreatedDate),
                link.Click,
                link.Registration,
                link.Bonus,
                link.Ftd,
                link.AvgFtdAmount,
                link.StatusId,
                link.StatusName,
                link.RowIdx
            )).ToList(),
            TotalItem = linkListResult.Data.TotalItem,
            PageIndex = request.PageIndex,
            PageSize = request.PageSize
        };

        return Result<PagingData<LinkResponse>>.Success(result);
    }
}

