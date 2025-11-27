using System.Collections.Concurrent;
using Fanex.Data.Repository;
using ONEHub.Domain.Entities;
using ONEHub.Domain.Errors;
using ONEHub.Domain.Params;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;
using ONEHub.Infrastructure.Repositories.Commands;
using ONEHub.Infrastructure.Repositories.Criterias;

namespace ONEHub.Infrastructure.Repositories;

public class AuthRepository(
    IDynamicRepository dynamicRepository
    )
    : BaseRepository(dynamicRepository), IAuthRepository
{
    private static readonly ConcurrentDictionary<int, List<string>> RefreshTokens = [];

    public async Task<Result<User>> GetUserByUserNameAsync(string userName)
    {
        var criteria = new GetUserByUserNameCriteria
        {
            UserName = userName
        };

        var result = await GetDataAsync<User>(criteria);

        if (result.IsSuccess && result.Data is null)
        {
            return Result<User>.Failure(AuthError.UserNotFound);
        }

        return result;
    }

    public async Task<Result<User>> GetUserByUserIdAsync(int userId)
    {
        var criteria = new GetUserByUserIdCriteria
        {
            UserId = userId
        };

        var result = await GetDataAsync<User>(criteria);

        if (result.IsSuccess && result.Data is null)
        {
            return Result<User>.Failure(AuthError.UserNotFound);
        }

        return result;
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

    public async Task<Result> CreateUserAsync(CreateUserParam param)
    {
        var command = new CreateUserCommand
        {
            UserName = param.UserName,
            PasswordHash = param.PasswordHash,
            IsAdmin = param.IsAdmin,
            UserId = param.UserId,
            Ip = param.Ip,
            Host = param.Host
        };
        var result = await ExecuteCommandAsync(command);

        return result;
    }
}
