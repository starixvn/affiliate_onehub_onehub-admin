using Fanex.Data.Repository;
using ONEHub.Domain.Params;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;
using ONEHub.Infrastructure.Repositories.Commands;
using ONEHub.Infrastructure.Repositories.Criterias;

namespace ONEHub.Infrastructure.Repositories;

public class LinkGeneratorRepository(IDynamicRepository dynamicRepository)
    : BaseRepository(dynamicRepository), ILinkGeneratorRepository
{
    public async Task<Result<string>> GetIDCodeAsync()
    {
        var criteria = new GetIDCodeCriteria();
        return await GetDataAsync<string>(criteria);
    }

    public async Task<Result> InsertLinkAsync(InsertLinkParam param)
    {
        var command = new InsertLinkCommand
        {
            LinkName = param.LinkName,
            IDCode = param.IDCode,
            CampaignId = param.CampaignId,
            CountryCode = param.CountryCode,
            MarketId = param.MarketId,
            EventIds = param.EventIds,
            GroupId = param.GroupId,
            ChannelId = param.ChannelId,
            AgencyId = param.AgencyId,
            TypeId = param.TypeId,
            PageCode = param.PageCode,
            PageType = param.PageType,
            DomainName = param.DomainName,
            DomainNote = param.DomainNote,
            Note = param.Note,
            ShortPath = param.ShortPath,
            ShortDomain = param.ShortDomain,
            FullLink = param.FullLink,
            SiteId = param.SiteId,
            StatusId = param.StatusId,
            UserId = param.UserId,
            Ip = param.Ip,
            Host = param.Host
        };

        var result = await ExecuteCommandAsync(command);

        return result;
    }
}

