using Fanex.Data;
using Fanex.Data.Repository;

namespace ONEHub.Domain.Commands.Auth;

public class ReCheckinCommandData : NonQueryCommand
{
    private const string SP_NAME = "Aff_Recheckin";

    public override string GetSettingKey() => SP_NAME;

    public override bool IsValid() => OnUserId > 0;

    [SpParam(SqlParamName = "On_UserId")]
    public int OnUserId { get; set; }

    public bool IsKickedOut { get; set; }
}

