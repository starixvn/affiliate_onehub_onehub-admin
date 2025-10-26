using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ONEHub.Application.Auth.Commands;
using ONEHub.Application.DTOs.Auth;
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
        try
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
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { IsSuccessful = false, ex.Message });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Login error for user {UserName}", request.UserName);
            return StatusCode(500, new { IsSuccessful = false, Message = "An error occurred during login" });
        }
    }


    [HttpPost("logout")]
    [Authorize]
    public async Task<ActionResult> Logout()
    {
        try
        {
            var command = new LogoutCommand();
            await mediator.Send(command);

            // Clear authentication cookies
            Response.Cookies.Delete("accessToken");
            Response.Cookies.Delete("refreshToken");

            return Ok(new { IsSuccessful = true, Message = "Logged out successfully" });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Logout error for OnUserId: {OnUserId}", sessionService.OnUserId);
            return StatusCode(500, new { IsSuccessful = false, Message = "An error occurred during logout" });
        }
    }

    [HttpGet("me")]
    [Authorize]
    public ActionResult<IApiResponse<UserMeDto>> GetCurrentUser()
    {
        try
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
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting current user info");
            return StatusCode(500, ApiResponse<UserMeDto>.Error(500, "Error retrieving user information"));
        }
    }

    [HttpPost("refresh-token")]
    [AllowAnonymous]
    public async Task<ActionResult<LoginDto>> RefreshToken([FromBody] RefreshTokenRequest request)
    {
        try
        {
            var command = new RefreshTokenCommand
            {
                RefreshToken = request.RefreshToken
            };

            var result = await mediator.Send(command);
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { ex.Message });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Refresh token error");
            return StatusCode(500, new { Message = "An error occurred while refreshing token" });
        }
    }
}

public record LoginRequest(string UserName, string Password);
public record RefreshTokenRequest(string RefreshToken);
