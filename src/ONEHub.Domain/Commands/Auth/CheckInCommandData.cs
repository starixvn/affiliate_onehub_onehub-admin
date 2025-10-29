using Fanex.Data;
using Fanex.Data.Repository;

namespace ONEHub.Domain.Commands.Auth;

public class CheckInCommandData : NonQueryCommand
{
    private const int SubAccId_AdminSite = 6;
    private const string SP_NAME = "Aff_CheckIn";

    public override string GetSettingKey() => SP_NAME;

    public override bool IsValid() => true;

    [SpParam(SqlParamName = "NetSessionId")]
    public string SessionId { get; set; } = string.Empty;

    [SpParam(SqlParamName = "CustId")]
    public int UserId { get; set; }

    public string ServerId { get; set; } = string.Empty;

    public string Ip { get; set; } = string.Empty;

    public int SubAccId { get; } = SubAccId_AdminSite;

    [SpParam(SqlParamName = "On_UserId")]
    public int OnUserId { get; set; }
}

