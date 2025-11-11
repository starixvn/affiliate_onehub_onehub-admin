using System.Text;
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
    public async Task<Result<LinkGeneratedResult>> Handle(InsertLinkCommand request, CancellationToken cancellationToken)
    {
        var shortLinkPath = request.ShortPath;
        var isAutoGeneratingShortPath = string.IsNullOrEmpty(shortLinkPath);

        if (isAutoGeneratingShortPath)
        {
            shortLinkPath = GenerateShortLinkValue();
        }

        const int MaxAttempts = 3;
        const int DuplicateErrorCode = 1006;

        for (var attempt = 1; attempt <= MaxAttempts; attempt++)
        {
            var fullLink = BuildFullLink(request);
            var shortLink = $"https://{request.ShortDomain}/{shortLinkPath}";

            var param = new InsertLinkParam
            {
                LinkName = request.LinkName,
                IDCode = request.IdentifierCode,
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
                ShortPath = shortLinkPath,
                ShortDomain = request.ShortDomain,
                FullLink = fullLink,
                UserId = request.UserId,
                Ip = request.Ip,
                Host = request.Host
            };

            var insertResult = await linkGeneratorRepository.InsertLinkAsync(param);

            if (insertResult.IsFailure)
            {
                var isDuplicateError = insertResult.Error.Code == DuplicateErrorCode;
                var canRetry = isAutoGeneratingShortPath && attempt < MaxAttempts && isDuplicateError;

                if (canRetry)
                {
                    shortLinkPath = GenerateShortLinkValue();
                    continue;
                }

                return Result<LinkGeneratedResult>.Failure(insertResult.Error);
            }

            var returnedIdCode = insertResult.Data;

            if (string.IsNullOrEmpty(request.IdentifierCode) && !string.IsNullOrEmpty(returnedIdCode))
            {
                fullLink = BuildFullLink(request, returnedIdCode);
            }

            var result = new LinkGeneratedResult
            {
                IDCode = returnedIdCode ?? request.IdentifierCode ?? string.Empty,
                FullLink = fullLink,
                ShortLink = shortLink
            };

            return Result<LinkGeneratedResult>.Success(result);
        }

        return Result<LinkGeneratedResult>.Failure(LinkGeneratorError.UniqueCodeGenerationFailed);
    }

    private static string GenerateShortLinkValue()
    {
        var timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
        var timestampBase36 = ConvertToBase36(timestamp);

        var random = new Random();
        const string Chars = "abcdefghijklmnopqrstuvwxyz0123456789";
        var randomPart = new string(Enumerable.Range(0, 4)
            .Select(_ => Chars[random.Next(Chars.Length)])
            .ToArray());

        return $"{timestampBase36}{randomPart}";
    }

    private static string ConvertToBase36(long value)
    {
        const string Chars = "0123456789abcdefghijklmnopqrstuvwxyz";

        if (value == 0)
        {
            return "0";
        }

        var result = new StringBuilder();

        while (value > 0)
        {
            result.Append(Chars[(int)(value % 36)]);
            value /= 36;
        }

        var chars = result.ToString().ToCharArray();
        Array.Reverse(chars);
        return new string(chars);
    }

    private static string BuildFullLink(InsertLinkCommand request, string? idCode = null)
    {
        var subdomain = request.PageType switch
        {
            1 => "www",
            2 => "m",
            3 => "landing",
            _ => "www"
        };

        var identifierCode = idCode ?? request.IdentifierCode ?? string.Empty;

        return $"https://{subdomain}.{request.DomainName}/{request.PageCode}" +
               $"?ln={Uri.EscapeDataString(request.LinkName)}" +
               $"&ic={Uri.EscapeDataString(identifierCode)}" +
               $"&cmp={Uri.EscapeDataString(request.CampaignCode)}" +
               $"&cty={Uri.EscapeDataString(request.CountryCode)}" +
               $"&lang={Uri.EscapeDataString(request.MarketId)}" +
               $"&ev={Uri.EscapeDataString(request.EventCodes)}" +
               $"&grp={Uri.EscapeDataString(request.GroupCode)}" +
               $"&chn={Uri.EscapeDataString(request.ChannelCode)}" +
               $"&ag={Uri.EscapeDataString(request.AgencyCode)}" +
               $"&type={Uri.EscapeDataString(request.TypeCode)}";
    }
}
