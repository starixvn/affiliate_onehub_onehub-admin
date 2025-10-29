using Fanex.Data;
using Fanex.Data.Repository;

namespace ONEHub.Domain.Commands.Auth;

public class LoginCommandData : NonQueryCommand
{
    private const string SP_NAME = "Aff_Admin_Login";

    public override string GetSettingKey() => SP_NAME;

    public override bool IsValid() => true;

    public string UserName { get; set; } = string.Empty;

    [SpParam(SqlParamName = "UserPwd")]
    public string Password { get; set; } = string.Empty;

    [SpParam(SqlParamName = "HostName")]
    public string UserHostName { get; set; } = string.Empty;

    public string Ip { get; set; } = string.Empty;

    public int UserId { get; set; }

    public int ErrCode { get; set; }

    public string ErrMsg { get; set; } = string.Empty;
}

