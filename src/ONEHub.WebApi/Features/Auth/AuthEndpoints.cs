using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MiniValidation;
using ONEHub.Application.Features.Auth.Commands;
using ONEHub.Application.Features.Auth.Queries;
using ONEHub.Application.Services;
using ONEHub.Application.Utils;
using ONEHub.Domain.Constants;
using ONEHub.Domain.Results;
using ONEHub.Domain.Settings;

namespace ONEHub.WebApi.Features.Auth;

public static class AuthEndpoints
{

    public static IEndpointRouteBuilder RegisterAuthEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var groupEndpoint = endpoints.MapGroup("/api/auth").RequireAuthorization();

        groupEndpoint.MapPost("/login", Login).AllowAnonymous();
        groupEndpoint.MapPost("/refresh", Refresh).AllowAnonymous();
        groupEndpoint.MapPost("/logout", Logout).AllowAnonymous();
        groupEndpoint.MapPost("/sso", Sso).AllowAnonymous();
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

        HttpContextUtils.SetCookie(contextAccessor.HttpContext, CookieKeys.INTERNAL_ACCESS_TOKEN, result.Data.AccessToken);
        HttpContextUtils.SetCookie(contextAccessor.HttpContext, CookieKeys.INTERNAL_REFRESH_TOKEN, result.Data.RefreshToken);

        return TypedResults.Ok(result);
    }


    private static async Task<Results<Ok<Result<RefreshTokenResponse>>, ValidationProblem, UnauthorizedHttpResult>> Refresh(
        IHttpContextAccessor contextAccessor,
        ICurrentUserService currentUserService,
        IMediator mediator)
    {
        var refreshToken = HttpContextUtils.GetCookie(contextAccessor.HttpContext, CookieKeys.INTERNAL_REFRESH_TOKEN);
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

        HttpContextUtils.SetCookie(contextAccessor.HttpContext, CookieKeys.INTERNAL_ACCESS_TOKEN, result.Data.AccessToken);

        return TypedResults.Ok(result);
    }

    private static async Task<Ok<Result>> Logout(
        IHttpContextAccessor contextAccessor,
        ICurrentUserService currentUserService,
        ICacheProvider cacheProvider)
    {
        var refreshToken = HttpContextUtils.GetCookie(contextAccessor.HttpContext, CookieKeys.INTERNAL_REFRESH_TOKEN);
        var userId = currentUserService.GetUserId();

        if (userId > 0 && !string.IsNullOrEmpty(refreshToken))
        {
            var cacheKey = $"{CacheKeys.INTERNAL_REFRESH_TOKEN}:{userId}:{refreshToken}";
            await cacheProvider.RemoveFromCacheAsync(cacheKey);
        }

        HttpContextUtils.ClearCookie(contextAccessor.HttpContext, CookieKeys.INTERNAL_ACCESS_TOKEN);
        HttpContextUtils.ClearCookie(contextAccessor.HttpContext, CookieKeys.INTERNAL_REFRESH_TOKEN);

        return TypedResults.Ok(Result.Success());
    }

    private static async Task<Results<Ok<Result<SsoResponse>>, UnauthorizedHttpResult>> Sso(
        IHttpContextAccessor contextAccessor,
        IMediator mediator)
    {
        var externalAuthToken = HttpContextUtils.GetCookie(contextAccessor.HttpContext, CookieKeys.EXTERNAL_AUTH_TOKEN);
        var externalRefreshToken = HttpContextUtils.GetCookie(contextAccessor.HttpContext, CookieKeys.EXTERNAL_REFRESH_TOKEN);

        var command = new SsoCommand
        {
            ExternalAccessToken = externalAuthToken,
            ExternalRefreshToken = string.IsNullOrEmpty(externalRefreshToken) ? null : externalRefreshToken
        };

        var result = await mediator.Send(command);

        if (result.IsFailure || result.Data is null)
        {
            return TypedResults.Unauthorized();
        }

        HttpContextUtils.SetCookie(contextAccessor.HttpContext, CookieKeys.INTERNAL_ACCESS_TOKEN, result.Data.AccessToken);
        HttpContextUtils.SetCookie(contextAccessor.HttpContext, CookieKeys.INTERNAL_REFRESH_TOKEN, result.Data.RefreshToken);

        return TypedResults.Ok(result);
    }

    private static async Task<Ok<Result<UserResponse>>> Profile(
        IMediator mediator)
    {
        var query = new GetUserQuery();

        var result = await mediator.Send(query);

        return TypedResults.Ok(result);
    }
}
