namespace ONEHub.Domain.Constants;

public static class GSheets
{
    public const string NoteColumn = "Note";
    public const string StatusColumn = "Status";
    public const string SubDomainColumn = "SubDomain";
    public const string ShortLinkColumn = "ShortLink";
    public const string DomainNameColumn = "DomainName";

    public const string EnabledStatus = "enable";

    public const string DefaultRateValue = "999";

    public const int MaxAcceptableRate = 30;
    public const int HeaderRowOffset = 1;
    public const int MinimumDataRows = 1;

    public static readonly int[] GetDomainTypes = [0, 1, 2];

    public static readonly int[] PutDomainTypes = [3];

    public static readonly string[] CountryCodes = ["VN", "MY", "ID", "CN", "BD", "TH", "KR", "IN"];

    public static readonly IReadOnlyDictionary<string, string> MappingCols = new Dictionary<string, string>
    {
        { DomainNameColumn, "V2_N_Domain" },
        { SubDomainColumn, "sub-domain" },
        { ShortLinkColumn, "short link" },
        { NoteColumn, "info" },
        { "IN", "TE不良率" },
        { "VN", "VN不良率" },
        { "MY", "EN不良率" },
        { "ID", "ID不良率" },
        { "CN", "CS不良率" },
        { "BD", "BD不良率" },
        { "TH", "TH不良率" },
        { "KR", "KO不良率" }
    };
}
