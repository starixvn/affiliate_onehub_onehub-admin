namespace ONEHub.Domain.Entities.Apis;

public class MemberSiteCustomerInfo
{
    public int CustomerId { get; set; }
    public int? SiteId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public int? CurrencyId { get; set; }
    public string UserLanguage { get; set; } = string.Empty;
    public int? AccountStatus { get; set; }
    public int? AgentId { get; set; }
    public string AllAgentIds { get; set; } = string.Empty;
    public int? UserLevel { get; set; }
    public bool? IsTest { get; set; }
    public int? Status { get; set; }
}

