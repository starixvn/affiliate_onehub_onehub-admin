using ONEHub.Application.Common;

namespace ONEHub.Application.Affiliates.Commands;

public class ChangeAffiliatePasswordCommand : BaseCommand
{
    public int AffiliateId { get; set; }
    public string Password { get; set; } = string.Empty;
}

