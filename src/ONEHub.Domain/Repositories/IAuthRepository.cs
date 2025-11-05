using ONEHub.Domain.Entities;
using ONEHub.Domain.Results;

namespace ONEHub.Domain.Repositories;

public interface IAuthRepository
{
    public Task<Result<User>> GetUserByUserNameAsync(string userName);

    public Task<Result<User>> GetUserByUserIdAsync(int userId);

    public Task<Result> StoreRefreshTokenByUserIdAsync(int userId, string refreshToken);

    public Task<Result<IEnumerable<string>>> GetRefreshTokenByUserIdAsync(int userId);
}
