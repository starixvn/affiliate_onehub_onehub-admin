using System.Collections.Concurrent;
using Fanex.Data.Repository;
using ONEHub.Domain.Constants;
using ONEHub.Domain.Entities;
using ONEHub.Domain.Errors;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;

namespace ONEHub.Infrastructure.Repositories;

public class AuthRepository(
    IDynamicRepository dynamicRepository
    )
    : BaseRepository(dynamicRepository), IAuthRepository
{
    private static readonly ConcurrentDictionary<int, User> MockUsers = new(
        new Dictionary<int, User>
        {
            [1] = new User
            {
                UserId = 1,
                UserName = "admin",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
                Avatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
                IsAdmin = true,
                Roles = []
            },
            [2] = new User
            {
                UserId = 2,
                UserName = "testuser",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("test123"),
                Avatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=testuser",
                IsAdmin = false,
                Roles = [Roles.PROFILE]
            }
        });

    private static readonly ConcurrentDictionary<int, List<string>> RefreshTokens = [];

    public Task<Result<User>> GetUserByUserNameAsync(string userName)
    {
        var user = MockUsers.Values.FirstOrDefault(u =>
            u.UserName.Equals(userName, StringComparison.OrdinalIgnoreCase));

        if (user is null)
        {
            return Task.FromResult(Result<User>.Failure(AuthError.UserNotFound));
        }

        var result = Result<User>.Success(user);
        return Task.FromResult(result);
    }

    public Task<Result<User>> GetUserByUserIdAsync(int userId)
    {
        var user = MockUsers.Values.FirstOrDefault(u => u.UserId == userId);

        if (user is null)
        {
            return Task.FromResult(Result<User>.Failure(AuthError.UserNotFound));
        }

        var result = Result<User>.Success(user);
        return Task.FromResult(result);
    }

    public Task<Result> StoreRefreshTokenByUserIdAsync(int userId, string refreshToken)
    {
        if (RefreshTokens.TryGetValue(userId, out var tokenList))
        {
            tokenList.Add(refreshToken);
        }
        else
        {
            RefreshTokens[userId] = [refreshToken];
        }

        return Task.FromResult(Result.Success());
    }

    public Task<Result<IEnumerable<string>>> GetRefreshTokenByUserIdAsync(int userId)
    {
        if (RefreshTokens.TryGetValue(userId, out var tokenList))
        {
            var result = Result<IEnumerable<string>>.Success(tokenList);
            return Task.FromResult(result);
        }
        return Task.FromResult(Result<IEnumerable<string>>.Failure(AuthError.InvalidToken));
    }
}
