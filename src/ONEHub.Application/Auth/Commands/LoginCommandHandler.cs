using MediatR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Auth;
using ONEHub.Domain.Commands.Auth;
using ONEHub.Domain.Criterias.Auth;
using ONEHub.Domain.DTOs.Common;
using ONEHub.Domain.Interfaces;
using System.Security.Claims;

namespace ONEHub.Application.Auth.Commands;

public class LoginCommandHandler : IRequestHandler<LoginCommand, LoginDto>
{
    private readonly IDynamicRepository _repository;
    private readonly ISessionService _sessionService;
    private readonly IAuthService _authService;
    private readonly IJwtTokenService _jwtTokenService;
    private readonly IConfiguration _configuration;
    private readonly ILogger<LoginCommandHandler> _logger;

    public LoginCommandHandler(
        IDynamicRepository repository,
        ISessionService sessionService,
        IAuthService authService,
        IJwtTokenService jwtTokenService,
        IConfiguration configuration,
        ILogger<LoginCommandHandler> logger)
    {
        _repository = repository;
        _sessionService = sessionService;
        _authService = authService;
        _jwtTokenService = jwtTokenService;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<LoginDto> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var loginCommand = new LoginCommandData
            {
                UserName = request.UserName.Trim(),
                Password = "56E8A2D78170E87C928E480797CC73",//Encryption.CfsEnCode(request.Password.Trim()),
                UserHostName = request.UserHostName,
                Ip = request.IpAddress
            };

            await _repository.ExecuteAsync(loginCommand);

            if (loginCommand.UserId <= 0 || loginCommand.ErrCode != 0)
            {
                _logger.LogWarning("Login failed for user {UserName}: {ErrorMessage}", request.UserName, loginCommand.ErrMsg);
                throw new UnauthorizedAccessException(loginCommand.ErrMsg);
            }

            var userId = loginCommand.UserId;

            var permissions = await _repository.FetchAsync<UserPermission>(new UserPermissionCriteria
            {
                UserId = userId
            });

            var permissionList = permissions.Where(p => !p.FunctionName.Contains("TransferPlayer")).ToList();

            if (!permissionList.Any())
            {
                _logger.LogWarning("User {UserName} has no permissions configured", request.UserName);
                throw new UnauthorizedAccessException("Your account is not configured to access any functions! Please contact your administrator");
            }

            var sessionId = Guid.NewGuid().ToString();
            var serverId = _configuration["AppSettings:ServerId"] ?? "DEFAULT-SERVER";

            var checkinCommand = new CheckInCommandData
            {
                SessionId = sessionId,
                UserId = userId,
                ServerId = serverId,
                Ip = request.IpAddress
            };

            await _repository.ExecuteAsync(checkinCommand);

            if (checkinCommand.OnUserId <= 0)
            {
                _logger.LogError("Failed to create session for user {UserName}", request.UserName);
                throw new InvalidOperationException("Failed to create session");
            }

            _sessionService.UserId = userId;
            _sessionService.OnUserId = checkinCommand.OnUserId;
            _sessionService.AffName = request.UserName;
            _sessionService.UserPermissionList = permissionList;

            var claims = _authService.GetClaims(userId, permissionList);
            _sessionService.ClaimIdentities = new List<ClaimsIdentity> { new ClaimsIdentity(claims) };

            var accessToken = _jwtTokenService.GenerateAccessToken(userId, request.UserName, permissionList, checkinCommand.OnUserId);
            var refreshToken = _jwtTokenService.GenerateRefreshToken();

            var expirationMinutes = int.Parse(_configuration["Jwt:AccessTokenExpirationMinutes"] ?? "60");

            _logger.LogInformation("User {UserName} (UserId: {UserId}) logged in successfully", request.UserName, userId);

            return new LoginDto
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                ExpiresAt = DateTime.UtcNow.AddMinutes(expirationMinutes),
                UserId = userId,
                UserName = request.UserName,
                FullName = request.UserName
            };
        }
        catch (UnauthorizedAccessException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error during login for user {UserName}", request.UserName);
            throw new InvalidOperationException("An error occurred during login", ex);
        }
    }
}

