namespace ONEHub.Domain.Entities;

public class DomainInfo
{
    public string DomainName { get; set; } = string.Empty;

    public int DomainType { get; set; }

    public DateTime CreatedDate { get; set; }

    public int SiteId { get; set; }

    public int Score { get; set; }
}

