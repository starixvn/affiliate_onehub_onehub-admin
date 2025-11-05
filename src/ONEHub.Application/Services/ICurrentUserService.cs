namespace ONEHub.Application.Services;

public interface ICurrentUserService
{
    public int GetUserId();

    public string GetUserName();

    public bool IsAuthenticated();

    public int GetUserIdFromExpiredToken();
}
