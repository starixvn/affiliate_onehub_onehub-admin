using ONEHub.Domain.Entities;
using ONEHub.Domain.Params;
using ONEHub.Domain.Results;

namespace ONEHub.Domain.Repositories;

public interface IAuthRepository
{
    Task<Result<User>> GetUserByUserNameAsync(string userName);

    Task<Result<User>> GetUserByUserIdAsync(int userId);

    Task<Result> StoreRefreshTokenByUserIdAsync(int userId, string refreshToken);

    Task<Result<IEnumerable<string>>> GetRefreshTokenByUserIdAsync(int userId);

    Task<Result> CreateUserAsync(CreateUserParam param);
}
