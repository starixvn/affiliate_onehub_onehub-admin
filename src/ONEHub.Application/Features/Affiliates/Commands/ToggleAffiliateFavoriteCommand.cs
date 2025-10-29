using ONEHub.Application.Common;

namespace ONEHub.Application.Features.Affiliates.Commands;

public class ToggleAffiliateFavoriteCommand : BaseCommand
{
    public int AffiliateId { get; set; }
    public bool IsFavorite { get; set; }
}

