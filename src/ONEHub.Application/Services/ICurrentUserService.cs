namespace ONEHub.Application.Services;

public interface ICurrentUserService
{
    int GetUserId();

    string GetUserName();

    bool IsAuthenticated();

    int GetUserIdFromExpiredToken();
}
