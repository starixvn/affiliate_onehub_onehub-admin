using System.Text;
using System.Security.Cryptography;
using MediatR;
using ONEHub.Application.Features.Shared;
using ONEHub.Domain.Entities;
using ONEHub.Domain.Errors;
using ONEHub.Domain.Params;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Features.LinkGenerator.Commands;

public class InsertLinkCommand : BaseCommand<LinkGeneratedResult>
{
    public string LinkName { get; set; } = string.Empty;

    public string? IdentifierCode { get; set; }

    public int CampaignId { get; set; }

    public string CampaignCode { get; set; } = string.Empty;

    public string CountryCode { get; set; } = string.Empty;

    public string MarketId { get; set; } = string.Empty;

    public string ShortedLanguageCode { get; set; } = string.Empty;

    public string EventIds { get; set; } = string.Empty;

    public string EventCodes { get; set; } = string.Empty;

    public int GroupId { get; set; }

    public string GroupCode { get; set; } = string.Empty;

    public int ChannelId { get; set; }

    public string ChannelCode { get; set; } = string.Empty;

    public int AgencyId { get; set; }

    public string AgencyCode { get; set; } = string.Empty;

    public int TypeId { get; set; }

    public string TypeCode { get; set; } = string.Empty;

    public string LandingPage { get; set; } = string.Empty;

    public int PageType { get; set; }

    public string PageCode { get; set; } = string.Empty;

    public string DomainName { get; set; } = string.Empty;

    public string DomainNote { get; set; } = string.Empty;

    public string ShortDomain { get; set; } = string.Empty;

    public string ShortPath { get; set; } = string.Empty;

    public string? Note { get; set; }
}

public class InsertLinkCommandHandler(
    ILinkGeneratorRepository linkGeneratorRepository)
    : IRequestHandler<InsertLinkCommand, Result<LinkGeneratedResult>>
{
    private const int MAX_ATTEMPTS = 3;
    private const int DUPLICATE_ERROR_CODE = 1006;

    public async Task<Result<LinkGeneratedResult>> Handle(InsertLinkCommand request, CancellationToken cancellationToken)
    {
        var idCodeResult = await RetrieveIDCodeAsync(request);
        if (idCodeResult.IsFailure)
        {
            return Result<LinkGeneratedResult>.Failure(idCodeResult.Error);
        }

        var idCode = idCodeResult.Data!;
        var shortPath = RetrieveShortPath(request.ShortPath, out var isAutoGenerating);

        for (var attempt = 1; attempt <= MAX_ATTEMPTS; attempt++)
        {
            var result = await TryInsertLinkAsync(request, idCode, shortPath);

            if (result.IsSuccess)
            {
                return result;
            }

            if (ShouldRetry(result, isAutoGenerating))
            {
                shortPath = GenerateShortPath();
                continue;
            }

            return result;
        }

        return Result<LinkGeneratedResult>.Failure(LinkGeneratorError.UniqueCodeGenerationFailed);
    }

    private async Task<Result<string>> RetrieveIDCodeAsync(InsertLinkCommand request)
    {
        if (!string.IsNullOrEmpty(request.IdentifierCode))
        {
            return Result<string>.Success(request.IdentifierCode);
        }

        var idCodeResult = await linkGeneratorRepository.GetIDCodeAsync();
        if (idCodeResult.IsFailure)
        {
            return Result<string>.Failure(idCodeResult.Error);
        }

        if (string.IsNullOrEmpty(idCodeResult.Data))
        {
            return Result<string>.Failure(LinkGeneratorError.InvalidIdentifierCode);
        }

        return Result<string>.Success(idCodeResult.Data);
    }

    private static string RetrieveShortPath(string? shortPath, out bool isAutoGenerating)
    {
        isAutoGenerating = string.IsNullOrEmpty(shortPath);
        return isAutoGenerating ? GenerateShortPath() : shortPath!;
    }

    private async Task<Result<LinkGeneratedResult>> TryInsertLinkAsync(
        InsertLinkCommand request,
        string identifierCode,
        string shortPath)
    {
        var fullLink = BuildFullLink(request, identifierCode);
        var shortLink = $"https://{request.ShortDomain}/{shortPath}";
        var param = BuildInsertParam(request, identifierCode, shortPath, fullLink);

        var insertResult = await linkGeneratorRepository.InsertLinkAsync(param);
        if (insertResult.IsFailure)
        {
            return Result<LinkGeneratedResult>.Failure(insertResult.Error);
        }

        var result = new LinkGeneratedResult
        {
            IDCode = identifierCode,
            FullLink = fullLink,
            ShortLink = shortLink
        };

        return Result<LinkGeneratedResult>.Success(result);
    }

    private static bool ShouldRetry(Result<LinkGeneratedResult> result, bool isAutoGenerating)
    {
        if (result.Error is null)
        {
            return false;
        }

        var isDuplicate = result.Error.Code == DUPLICATE_ERROR_CODE;
        return isAutoGenerating && isDuplicate;
    }

    private static InsertLinkParam BuildInsertParam(
        InsertLinkCommand request,
        string identifierCode,
        string shortPath,
        string fullLink)
    {
        return new InsertLinkParam
        {
            LinkName = request.LinkName,
            IDCode = identifierCode,
            CampaignId = request.CampaignId,
            CountryCode = request.CountryCode,
            MarketId = request.MarketId,
            EventIds = request.EventIds,
            GroupId = request.GroupId,
            ChannelId = request.ChannelId,
            AgencyId = request.AgencyId,
            TypeId = request.TypeId,
            PageCode = request.PageCode,
            PageType = request.PageType,
            DomainName = request.DomainName,
            DomainNote = request.DomainNote,
            Note = request.Note,
            ShortPath = shortPath,
            ShortDomain = request.ShortDomain,
            FullLink = fullLink,
            UserId = request.UserId,
            Ip = request.Ip,
            Host = request.Host
        };
    }

    private static string GenerateShortPath()
    {
        var timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
        var timestampBase36 = ConvertToBase36(timestamp);
        const string Chars = "abcdefghijklmnopqrstuvwxyz0123456789";
        var randomPart = new string(Enumerable.Range(0, 4)
            .Select(_ => Chars[RandomNumberGenerator.GetInt32(Chars.Length)])
            .ToArray());
        return $"{timestampBase36}{randomPart}";
    }

    private static string ConvertToBase36(long value)
    {
        const int Base36 = 36;
        const string Chars = "0123456789abcdefghijklmnopqrstuvwxyz";
        if (value == 0)
        {
            return "0";
        }

        var result = new StringBuilder();
        while (value > 0)
        {
            result.Append(Chars[(int)(value % Base36)]);
            value /= Base36;
        }

        var chars = result.ToString().ToCharArray();
        Array.Reverse(chars);
        return new string(chars);
    }

    private static string BuildFullLink(InsertLinkCommand request, string identifierCode)
    {
        var subdomain = request.PageType switch
        {
            1 => "www",
            2 => "m",
            3 => "landing",
            _ => "www"
        };

        return $"https://{subdomain}.{request.DomainName}/{Uri.EscapeDataString(request.PageCode)}" +
               $"?ln={Uri.EscapeDataString(request.LinkName)}" +
               $"&ic={Uri.EscapeDataString(identifierCode)}" +
               $"&cmp={Uri.EscapeDataString(request.CampaignCode)}" +
               $"&cty={Uri.EscapeDataString(request.CountryCode)}" +
               $"&lang={Uri.EscapeDataString(request.ShortedLanguageCode)}" +
               $"&ev={Uri.EscapeDataString(request.EventCodes)}" +
               $"&grp={Uri.EscapeDataString(request.GroupCode)}" +
               $"&chn={Uri.EscapeDataString(request.ChannelCode)}" +
               $"&ag={Uri.EscapeDataString(request.AgencyCode)}" +
               $"&type={Uri.EscapeDataString(request.TypeCode)}";
    }
}
