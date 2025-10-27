using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ONEHub.Application.Auth.Commands;
using ONEHub.Application.DTOs.Auth;
using ONEHub.Domain.Constants;
using ONEHub.Domain.Interfaces;

namespace ONEHub.WebApi.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ISessionService _sessionService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(
        IMediator mediator,
        ISessionService sessionService,
        ILogger<AuthController> _logger)
    {
        _mediator = mediator;
        _sessionService = sessionService;
        this._logger = _logger;
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<LoginDto>> Login([FromBody] LoginRequest request)
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

            var result = await _mediator.Send(command);

            // Set JWT in HttpOnly cookie (secure, not accessible by JavaScript)
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,  // Cannot be accessed by JavaScript (XSS protection)
                Secure = false,   // DEVELOPMENT: Set to true in production for HTTPS only
                SameSite = SameSiteMode.Lax,  // Lax for development (Strict in production)
                Expires = result.ExpiresAt,
                Path = "/"
            };

            Response.Cookies.Append("accessToken", result.AccessToken, cookieOptions);
            Response.Cookies.Append("refreshToken", result.RefreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = false,   // DEVELOPMENT: Set to true in production
                SameSite = SameSiteMode.Lax,
                Expires = DateTimeOffset.UtcNow.AddDays(7),
                Path = "/"
            });

            // Return success response WITHOUT tokens (tokens are in cookies)
            return Ok(new
            {
                IsSuccessful = true,
                Message = "Login successful",
                UserId = result.UserId,
                UserName = result.UserName,
                FullName = result.FullName
            });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { IsSuccessful = false, Message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Login error for user {UserName}", request.UserName);
            return StatusCode(500, new { IsSuccessful = false, Message = "An error occurred during login" });
        }
    }

    [HttpGet("ping")]
    [Authorize]
    public async Task<ActionResult> Ping()
    {
        try
        {
            var isKickedOut = true;

            if (_sessionService.OnUserId > 0 && _sessionService.UserId > 0)
            {
                var command = new ReCheckinCommand { OnUserId = _sessionService.OnUserId };
                isKickedOut = await _mediator.Send(command);
            }

            return Ok(new
            {
                IsKickedOut = isKickedOut,
                Message = isKickedOut ? "Your session has expired. Please login again." : string.Empty
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ping error for OnUserId: {OnUserId}", _sessionService.OnUserId);
            return Ok(new { IsKickedOut = true, Message = "Error checking session" });
        }
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<ActionResult> Logout()
    {
        try
        {
            var command = new LogoutCommand();
            await _mediator.Send(command);

            // Clear authentication cookies
            Response.Cookies.Delete("accessToken");
            Response.Cookies.Delete("refreshToken");

            return Ok(new { IsSuccessful = true, Message = "Logged out successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Logout error for OnUserId: {OnUserId}", _sessionService.OnUserId);
            return StatusCode(500, new { IsSuccessful = false, Message = "An error occurred during logout" });
        }
    }

    [HttpGet("me")]
    [Authorize]
    public IActionResult GetCurrentUser()
    {
        try
        {
            var userId = User.FindFirst("userId")?.Value;
            var userName = User.FindFirst("userName")?.Value;
            var onUserId = User.FindFirst("onUserId")?.Value;

            if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(userName))
            {
                return Unauthorized(new { IsSuccessful = false, Message = "Invalid token" });
            }

            var claims = _sessionService.ClaimIdentities
                .SelectMany(i => i.Claims)
                .Select(c => new { Type = c.Type, Value = c.Value })
                .ToList();

            return Ok(new
            {
                IsSuccessful = true,
                UserId = int.Parse(userId),
                UserName = userName,
                OnUserId = int.Parse(onUserId ?? "0"),
                Claims = claims
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting current user info");
            return StatusCode(500, new { IsSuccessful = false, Message = "Error retrieving user information" });
        }
    }

    [HttpGet("menu")]
    [Authorize]
    public IActionResult GetUserMenu()
    {
        try
        {
            if (_sessionService.ClaimIdentities == null || !_sessionService.ClaimIdentities.Any())
            {
                _logger.LogWarning("User has no claim identities");
                return Ok(new { IsSuccessful = true, Menus = new List<MenuDto>() });
            }

            var claims = _sessionService.ClaimIdentities.SelectMany(i => i.Claims).ToList();
            var menus = new List<MenuDto>();

            var menuDefinitions = new List<(string Key, string DisplayName, string Permission, string? AlternatePermission)>
            {
                //("Customer", "Customer", Function.Affiliate, null),
                //("Affiliate", "Affiliate", Function.Affiliate, null),
                //("Operation", "Operation", Function.Deal, null),
                //("Player", "Player", Function.Player, null),
                //("Report", "Report", Function.AffReport, Function.TransferPlayerReport),
                //("MediaGallery", "Media Gallery", Function.Media, null),
                //("Message", "Message", Function.HotNews, null),
                //("Administrator", "Administrator", Function.UserControl, null),
                //("Domain", "Domain", Function.Domain, null)
            };

            foreach (var (key, displayName, permission, alternatePermission) in menuDefinitions)
            {
                var hasPermission = claims.Any(p => p.Type == permission) ||
                                  (alternatePermission != null && claims.Any(p => p.Type == alternatePermission));

                if (hasPermission)
                {
                    menus.Add(new MenuDto
                    {
                        Key = key,
                        DisplayName = displayName
                    });
                }
            }

            var marketingToolsSubmenus = BuildMarketingToolsSubmenus(claims);
            if (marketingToolsSubmenus.Any())
            {
                menus.Add(new MenuDto
                {
                    Key = "MarketingTools",
                    DisplayName = "Marketing Tools",
                    Submenus = marketingToolsSubmenus
                });
            }

            return Ok(new
            {
                IsSuccessful = true,
                Menus = menus
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user menu");
            return StatusCode(500, new { IsSuccessful = false, Message = "Error retrieving menu" });
        }
    }

    private static List<SubmenuDto> BuildMarketingToolsSubmenus(List<System.Security.Claims.Claim> claims)
    {
        var submenus = new List<SubmenuDto>();

        if (claims.Any(p => p.Type == Function.PageManagement))
        {
            submenus.Add(new SubmenuDto
            {
                Key = "LandingPageManagement",
                Controller = "LandingPage",
                Action = "Index",
                DisplayName = "Landing Page Management"
            });
        }
        else if (claims.Any(p => p.Type == Function.AssetUploader))
        {
            submenus.Add(new SubmenuDto
            {
                Key = "LandingPageManagement",
                Controller = "AssetUploader",
                Action = "Index",
                DisplayName = "Landing Page Management"
            });
        }
        else if (claims.Any(p => p.Type == Function.RegistrationFormUploader))
        {
            submenus.Add(new SubmenuDto
            {
                Key = "LandingPageManagement",
                Controller = "FormManagement",
                Action = "Index",
                DisplayName = "Landing Page Management"
            });
        }

        if (claims.Any(p => p.Type == Function.AllCampaigns))
        {
            submenus.Add(new SubmenuDto
            {
                Key = "CampaignManagement",
                Controller = "CampaignManagement",
                Action = "Index",
                DisplayName = "Campaign Management"
            });
        }

        return submenus;
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

            var result = await _mediator.Send(command);
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { Message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Refresh token error");
            return StatusCode(500, new { Message = "An error occurred while refreshing token" });
        }
    }

    [HttpGet("recheckin")]
    [Authorize]
    public IActionResult ReCheckIn()
    {
        try
        {
            return Ok(new { IsSuccessful = true, Message = "Session active" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "ReCheckIn error");
            return StatusCode(500, new { IsSuccessful = false, Message = "Error checking session" });
        }
    }
}

public record LoginRequest(string UserName, string Password);
public record RefreshTokenRequest(string RefreshToken);
