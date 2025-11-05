using Fanex.Data.Repository;

namespace ONEHub.Infrastructure.Repositories.Criterias;

public class GetUserByUserIdCriteria : CriteriaBase
{
    public override string GetSettingKey() => "OH_User_Login_UserInfoSel";

    public override bool IsValid() => UserId > 0;

    public int UserId { get; set; }
}
