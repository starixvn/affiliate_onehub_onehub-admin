using Fanex.Data.Repository;

namespace ONEHub.Infrastructure.Repositories.Criterias;

public class GetUserByUserNameCriteria : CriteriaBase
{
    public override string GetSettingKey() => "OH_UserInfo_Sel";

    public override bool IsValid() => !string.IsNullOrWhiteSpace(UserName);

    public string UserName { get; set; } = string.Empty;
}
