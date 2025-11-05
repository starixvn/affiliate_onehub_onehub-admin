using MediatR;
using ONEHub.Application.Features.Shared;
using ONEHub.Domain.Errors;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Features.Auth.Queries;

public class GetUserQuery : BaseQuery<UserResponse>;

public record UserResponse(int UserId, string UserName, string Avatar);

public class GetUserHandler(IAuthRepository authRepository) : IRequestHandler<GetUserQuery, Result<UserResponse>>
{
    public async Task<Result<UserResponse>> Handle(GetUserQuery request, CancellationToken cancellationToken)
    {
        var userResult = await authRepository.GetUserByUserIdAsync(request.UserId);

        if (userResult.IsFailure)
        {
            return Result<UserResponse>.Failure(userResult.Error);
        }

        if (userResult.Data is null)
        {
            return Result<UserResponse>.Failure(AuthError.UserNotFound);
        }

        var result = new UserResponse(
            userResult.Data.UserId,
            userResult.Data.UserName,
            userResult.Data.Avatar
        );
        return Result<UserResponse>.Success(result);
    }
}
