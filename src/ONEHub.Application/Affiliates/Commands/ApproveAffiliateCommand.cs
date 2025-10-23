using ONEHub.Application.Common;
using ONEHub.Domain.Common;

namespace ONEHub.Application.Affiliates.Commands;

public class ApproveAffiliateCommand : BaseCommand<ResultInfo<string>>
{
    public int AffiliateId { get; set; }
    public string Password { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}

