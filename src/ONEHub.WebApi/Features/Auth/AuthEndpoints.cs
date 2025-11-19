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
        IOptions<JwtSetting> jwtOptions,
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

        SetAuthTokenCookies(contextAccessor.HttpContext, result.Data.AccessToken, result.Data.RefreshToken, jwtOptions.Value);

        return TypedResults.Ok(result);
    }


    private static async Task<Results<Ok<Result<RefreshTokenResponse>>, ValidationProblem, UnauthorizedHttpResult>> Refresh(
        IHttpContextAccessor contextAccessor,
        ICurrentUserService currentUserService,
        IOptions<JwtSetting> jwtOptions,
        IMediator mediator)
    {
        var refreshToken = HttpContextUtils.GetCookie(contextAccessor.HttpContext, CookieKeys.REFRESH_TOKEN);
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

        SetAccessTokenCookie(contextAccessor.HttpContext, result.Data.AccessToken, jwtOptions.Value);

        return TypedResults.Ok(result);
    }

    private static async Task<Ok<Result>> Logout(
        IHttpContextAccessor contextAccessor,
        ICurrentUserService currentUserService,
        ICacheProvider cacheProvider)
    {
        var refreshToken = HttpContextUtils.GetCookie(contextAccessor.HttpContext, CookieKeys.REFRESH_TOKEN);
        var userId = currentUserService.GetUserId();

        if (userId > 0 && !string.IsNullOrEmpty(refreshToken))
        {
            var cacheKey = $"{CacheKeys.REFRESH_TOKEN}:{userId}:{refreshToken}";
            await cacheProvider.RemoveFromCacheAsync(cacheKey);
        }

        HttpContextUtils.ClearCookie(contextAccessor.HttpContext, CookieKeys.ACCESS_TOKEN);
        HttpContextUtils.ClearCookie(contextAccessor.HttpContext, CookieKeys.REFRESH_TOKEN);

        return TypedResults.Ok(Result.Success());
    }

    private static async Task<Results<Ok<Result<SsoResponse>>, UnauthorizedHttpResult>> Sso(
        IHttpContextAccessor contextAccessor,
        IOptions<JwtSetting> jwtOptions,
        IMediator mediator)
    {
        var externalAccessToken = HttpContextUtils.GetCookie(contextAccessor.HttpContext, CookieKeys.EXTERNAL_ACCESS_TOKEN);

        var command = new SsoCommand
        {
            ExternalAccessToken = externalAccessToken
        };

        var result = await mediator.Send(command);

        if (result.IsFailure || result.Data is null)
        {
            return TypedResults.Unauthorized();
        }

        SetAuthTokenCookies(contextAccessor.HttpContext, result.Data.AccessToken, result.Data.RefreshToken, jwtOptions.Value);

        return TypedResults.Ok(result);
    }

    private static async Task<Ok<Result<UserResponse>>> Profile(
        IMediator mediator)
    {
        var query = new GetUserQuery();

        var result = await mediator.Send(query);

        return TypedResults.Ok(result);
    }

    private static void SetAuthTokenCookies(HttpContext? httpContext, string accessToken, string refreshToken, JwtSetting jwtSetting)
    {
        var accessTokenExpiration = TimeSpan.FromMinutes(jwtSetting.AccessTokenExpirationMinutes * 2);
        var refreshTokenExpiration = TimeSpan.FromDays(jwtSetting.RefreshTokenExpirationDays * 2);

        HttpContextUtils.SetCookie(httpContext, CookieKeys.ACCESS_TOKEN, accessToken, accessTokenExpiration);
        HttpContextUtils.SetCookie(httpContext, CookieKeys.REFRESH_TOKEN, refreshToken, refreshTokenExpiration);
    }

    private static void SetAccessTokenCookie(HttpContext? httpContext, string accessToken, JwtSetting jwtSetting)
    {
        var accessTokenExpiration = TimeSpan.FromMinutes(jwtSetting.AccessTokenExpirationMinutes * 2);
        HttpContextUtils.SetCookie(httpContext, CookieKeys.ACCESS_TOKEN, accessToken, accessTokenExpiration);
    }
}
