using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using MiniValidation;
using ONEHub.Application.Features.Auth.Commands;
using ONEHub.Application.Features.Auth.Queries;
using ONEHub.Application.Services;
using ONEHub.Application.Utils;
using ONEHub.Domain.Results;

namespace ONEHub.WebApi.Features.Auth;

public static class AuthEndpoints
{
    private const string ACCESS_TOKEN_KEY = "accessToken";

    private const string REFRESH_TOKEN_KEY = "refreshToken";

    public static IEndpointRouteBuilder RegisterAuthEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var groupEndpoint = endpoints.MapGroup("/api/auth").RequireAuthorization();

        groupEndpoint.MapPost("/login", Login).AllowAnonymous();
        groupEndpoint.MapPost("/refresh", Refresh).AllowAnonymous();
        groupEndpoint.MapPost("/logout", Logout).AllowAnonymous();
        groupEndpoint.MapGet("/me", Profile);

        return groupEndpoint;
    }

    private static async Task<Results<Ok<Result<LoginResponse>>, ValidationProblem, UnauthorizedHttpResult>> Login(
        [FromBody] LoginRequest request,
        IHttpContextAccessor contextAccessor,
        IMediator mediator)
    {
        if (!MiniValidator.TryValidate(request, out var errors))
        {
            return TypedResults.ValidationProblem(errors);
        }

        var command = new LoginCommand
        {
            UserName = request.Username,
            Password = request.Password
        };

        var result = await mediator.Send(command);

        if (result.IsFailure || result.Data is null)
        {
            return TypedResults.Unauthorized();
        }

        HttpContextUtils.SetCookie(contextAccessor.HttpContext, ACCESS_TOKEN_KEY, result.Data.AccessToken);
        HttpContextUtils.SetCookie(contextAccessor.HttpContext, REFRESH_TOKEN_KEY, result.Data.RefreshToken);

        return TypedResults.Ok(result);
    }


    private static async Task<Results<Ok<Result<RefreshTokenResponse>>, ValidationProblem, UnauthorizedHttpResult>> Refresh(
        IHttpContextAccessor contextAccessor,
        ICurrentUserService currentUserService,
        IMediator mediator)
    {
        var refreshToken = HttpContextUtils.GetCookie(contextAccessor.HttpContext, REFRESH_TOKEN_KEY);
        var userId = currentUserService.GetUserIdFromExpiredToken();

        if (userId <= 0)
        {
            return TypedResults.Unauthorized();
        }

        var command = new RefreshTokenCommand
        {
            RefreshToken = refreshToken,
            UserId = userId
        };

        var result = await mediator.Send(command);

        if (result.IsFailure || result.Data is null)
        {
            return TypedResults.Unauthorized();
        }

        HttpContextUtils.SetCookie(contextAccessor.HttpContext, ACCESS_TOKEN_KEY, result.Data.AccessToken);

        return TypedResults.Ok(result);
    }

    private static Task<Ok<Result>> Logout(
        IHttpContextAccessor contextAccessor)
    {
        HttpContextUtils.ClearCookie(contextAccessor.HttpContext, ACCESS_TOKEN_KEY);
        HttpContextUtils.ClearCookie(contextAccessor.HttpContext, REFRESH_TOKEN_KEY);

        return Task.FromResult(TypedResults.Ok(Result.Success()));
    }

    private static async Task<Ok<Result<UserResponse>>> Profile(
        IMediator mediator)
    {
        var query = new GetUserQuery();

        var result = await mediator.Send(query);

        return TypedResults.Ok(result);
    }
}
