using ONEHub.Application.Common;

namespace ONEHub.Application.Features.Auth.Commands;

public class ReCheckinCommand : BaseCommand<bool>
{
    public int OnUserId { get; set; }
}

