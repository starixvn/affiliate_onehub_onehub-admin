using Fanex.Data.Repository;

namespace ONEHub.Domain.Commands.LandingPages;

public class InsertLandingPageDealCommand : NonQueryCommand
{
    private const string SP_NAME = "Aff_LandingPage_Deal_Ins";

    public override string GetSettingKey() => SP_NAME;

    public override bool IsValid() => DealId > 0;

    public int DealId { get; set; }
}
