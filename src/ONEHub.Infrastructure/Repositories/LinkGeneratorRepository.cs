using Fanex.Data.Repository;
using ONEHub.Domain.Params;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;
using ONEHub.Infrastructure.Repositories.Commands;

namespace ONEHub.Infrastructure.Repositories;

public class LinkGeneratorRepository(IDynamicRepository dynamicRepository)
    : BaseRepository(dynamicRepository), ILinkGeneratorRepository
{
    public async Task<Result<string>> InsertLinkAsync(InsertLinkParam param)
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

        await dynamicRepository.ExecuteAsync(command);

        if (command.ErrCode != 0 || !string.IsNullOrWhiteSpace(command.ErrMsg))
        {
            return Result<string>.Failure(new Domain.Errors.Error(command.ErrCode, command.ErrMsg));
        }

        return Result<string>.Success(command.IDCode ?? string.Empty);
    }
}

