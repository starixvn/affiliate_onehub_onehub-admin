using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ONEHub.Application.DTOs.Auth;
using ONEHub.Application.Features.Auth.Commands;
using ONEHub.Domain.Interfaces;
using ONEHub.WebApi.Models;

namespace ONEHub.WebApi.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(
    IMediator mediator,
    ISessionService sessionService,
    ILogger<AuthController> logger)
    : ControllerBase
{
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<IApiResponse<LoginDto>>> Login([FromBody] LoginRequest request)
    {
        var command = new LoginCommand
        {
            UserName = request.UserName,
            Password = request.Password,
            IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown",
            UserHostName = HttpContext.Request.Host.Host
        };

        var result = await mediator.Send(command);

        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = false,
            SameSite = SameSiteMode.Lax,
            Expires = result.ExpiresAt,
            Path = "/"
        };

        Response.Cookies.Append("accessToken", result.AccessToken, cookieOptions);
        Response.Cookies.Append("refreshToken", result.RefreshToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = false,
            SameSite = SameSiteMode.Lax,
            Expires = DateTimeOffset.UtcNow.AddDays(7),
            Path = "/"
        });

        return Ok(ApiResponse<LoginDto>.Success(result));
    }


    [HttpPost("logout")]
    [Authorize]
    public async Task<ActionResult> Logout()
    {
        var command = new LogoutCommand
        {
            IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown"
        };
        await mediator.Send(command);

        Response.Cookies.Delete("accessToken");
        Response.Cookies.Delete("refreshToken");

        return Ok(new { IsSuccessful = true, Message = "Logged out successfully" });
    }

    [HttpGet("me")]
    [Authorize]
    public ActionResult<IApiResponse<UserMeDto>> GetCurrentUser()
    {
        var userId = User.FindFirst("userId")?.Value;
        var userName = User.FindFirst("userName")?.Value;
        var onUserId = User.FindFirst("onUserId")?.Value;

        if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(userName))
        {
            return Unauthorized(ApiResponse<UserMeDto>.Error(401, "Invalid token"));
        }

        var claims = sessionService.ClaimIdentities
            .SelectMany(i => i.Claims)
            .Select(c => new ClaimDto { Type = c.Type, Value = c.Value })
            .ToList();

        var userMeDto = new UserMeDto
        {
            UserId = int.Parse(userId),
            UserName = userName,
            OnUserId = int.Parse(onUserId ?? "0"),
            Claims = claims
        };

        return Ok(ApiResponse<UserMeDto>.Success(userMeDto));
    }

    [HttpPost("refresh")]
    [AllowAnonymous]
    public async Task<ActionResult<IApiResponse<LoginDto>>> RefreshToken()
    {
        var refreshToken = string.Empty;
        if (Request.Cookies.TryGetValue("refreshToken", out var cookieToken))
        {
            refreshToken = cookieToken;
        }

        var command = new RefreshTokenCommand
        {
            RefreshToken = refreshToken,
            IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown"
        };

        var result = await mediator.Send(command);

        if (result.IsFailure)
        {
            logger.LogWarning("Refresh token failed: {ErrorMessage}", result.Error.Message);
            return Unauthorized(ApiResponse<LoginDto>.Error(result.Error.Code, result.Error.Message));
        }

        var loginDto = result.Result;
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = false,
            SameSite = SameSiteMode.Lax,
            Expires = loginDto.ExpiresAt,
            Path = "/"
        };

        Response.Cookies.Append("accessToken", loginDto.AccessToken, cookieOptions);

        return Ok(ApiResponse<LoginDto>.Success(loginDto));
    }
}

public record LoginRequest(string UserName, string Password);
public record RefreshTokenRequest(string RefreshToken);
