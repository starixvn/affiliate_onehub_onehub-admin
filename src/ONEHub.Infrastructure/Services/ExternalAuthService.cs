using System.Net.Http.Headers;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using ONEHub.Application.Services;
using ONEHub.Domain.Entities;
using ONEHub.Domain.Errors;
using ONEHub.Domain.Results;
using ONEHub.Domain.Settings;

namespace ONEHub.Infrastructure.Services;

public class ExternalAuthService(
    HttpClient httpClient,
    IOptions<ExternalAuthSetting> externalAuthSetting,
    ILogger<ExternalAuthService> logger)
    : IExternalAuthService
{
    private readonly ExternalAuthSetting _externalAuthSetting = externalAuthSetting.Value;

    public async Task<Result<User>> ValidateTokenAsync(string authToken)
    {
        var validationUrl = $"{_externalAuthSetting.Host}/api/auth/validate";
        using var request = new HttpRequestMessage(HttpMethod.Post, validationUrl);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", authToken);

        using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(_externalAuthSetting.TimeoutSeconds));
        var response = await httpClient.SendAsync(request, cts.Token);

        if (!response.IsSuccessStatusCode)
        {
            logger.LogWarning("External token validation failed with status code {StatusCode}", response.StatusCode);
            return Result<User>.Failure(AuthError.InvalidToken);
        }

        var content = await response.Content.ReadAsStringAsync();
        ExternalValidationResponse? validationResponse;

        try
        {
            validationResponse = JsonSerializer.Deserialize<ExternalValidationResponse>(content, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
        }
        catch (JsonException ex)
        {
            logger.LogError(ex, "Failed to deserialize external validation response: {Content}", content);
            return Result<User>.Failure(AuthError.InvalidToken);
        }

        if (validationResponse == null)
        {
            logger.LogWarning("External validation response is null");
            return Result<User>.Failure(AuthError.InvalidToken);
        }

        if (validationResponse.Code == 1004)
        {
            logger.LogWarning("External token expired (code 1004)");
            return Result<User>.Failure(AuthError.ExpiredToken);
        }

        if (validationResponse.Code != 0)
        {
            logger.LogWarning("External validation failed with code {Code}: {Message}", validationResponse.Code, validationResponse.Message);
            return Result<User>.Failure(AuthError.InvalidToken);
        }

        if (validationResponse.Result == null || !validationResponse.Result.IsValid)
        {
            logger.LogWarning("External validation result is invalid");
            return Result<User>.Failure(AuthError.InvalidToken);
        }

        var resultData = validationResponse.Result;

        var user = new User
        {
            UserId = resultData.UserId,
            UserName = resultData.Username,
            Roles = resultData.Roles ?? string.Empty,
            Avatar = resultData.Avatar ?? string.Empty,
            IsAdmin = resultData.IsAdmin,
            PasswordHash = resultData.HashPassword
        };

        return Result<User>.Success(user);
    }


    public async Task<Result<string>> RefreshTokenAsync(string refreshToken)
    {
        var refreshUrl = $"{_externalAuthSetting.Host}/api/auth/refresh";
        using var request = new HttpRequestMessage(HttpMethod.Post, refreshUrl);
        request.Headers.Add("X-Refresh-Token", refreshToken);

        using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(_externalAuthSetting.TimeoutSeconds));
        var response = await httpClient.SendAsync(request, cts.Token);

        if (!response.IsSuccessStatusCode)
        {
            logger.LogWarning("Token refresh request failed with status code {StatusCode}", response.StatusCode);
            return Result<string>.Failure(AuthError.InvalidToken);
        }

        var content = await response.Content.ReadAsStringAsync();
        ExternalRefreshResponse? refreshResponse;

        try
        {
            refreshResponse = JsonSerializer.Deserialize<ExternalRefreshResponse>(content, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
        }
        catch (JsonException ex)
        {
            logger.LogError(ex, "Failed to deserialize refresh response: {Content}", content);
            return Result<string>.Failure(AuthError.InvalidToken);
        }

        if (refreshResponse == null)
        {
            logger.LogWarning("Refresh response is null");
            return Result<string>.Failure(AuthError.InvalidToken);
        }

        if (refreshResponse.Code != 0)
        {
            logger.LogWarning("Token refresh failed with code {Code}: {Message}", refreshResponse.Code, refreshResponse.Message);
            return Result<string>.Failure(AuthError.InvalidToken);
        }

        if (refreshResponse.Result == null || string.IsNullOrEmpty(refreshResponse.Result.AccessToken))
        {
            logger.LogWarning("Refresh result is invalid or missing access token");
            return Result<string>.Failure(AuthError.InvalidToken);
        }

        return Result<string>.Success(refreshResponse.Result.AccessToken);
    }
}

internal record ExternalValidationResponse(
    int Code,
    string Message,
    ExternalValidationResult? Result);

internal record ExternalValidationResult(
    bool IsValid,
    int UserId,
    string Username,
    string Email,
    bool IsAdmin,
    string HashPassword,
    string? Roles,
    string? Avatar,
    DateTime ExpiresAt,
    DateTime IssuedAt);

internal record ExternalRefreshResponse(
    int Code,
    string Message,
    ExternalRefreshResult? Result);

internal record ExternalRefreshResult(
    string AccessToken,
    string RefreshToken);
