using System.Net.Http.Headers;
using System.Text.Json;
using Microsoft.Extensions.Options;
using ONEHub.Application.Services;
using ONEHub.Domain.Entities;
using ONEHub.Domain.Errors;
using ONEHub.Domain.Results;
using ONEHub.Domain.Settings;

namespace ONEHub.Infrastructure.Services;

public class ExternalAuthService(
    HttpClient httpClient,
    IOptions<ExternalAuthSetting> externalAuthSetting)
    : IExternalAuthService
{
    private readonly ExternalAuthSetting _externalAuthSetting = externalAuthSetting.Value;

    public async Task<Result<User>> ValidateTokenAsync(string authToken, string? refreshToken = null)
    {
        try
        {
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", authToken);

            if (!string.IsNullOrEmpty(refreshToken))
            {
                if (httpClient.DefaultRequestHeaders.Contains("X-Refresh-Token"))
                {
                    httpClient.DefaultRequestHeaders.Remove("X-Refresh-Token");
                }
                httpClient.DefaultRequestHeaders.Add("X-Refresh-Token", refreshToken);
            }

            httpClient.Timeout = TimeSpan.FromSeconds(_externalAuthSetting.TimeoutSeconds);

            var response = await httpClient.PostAsync(_externalAuthSetting.ValidationApiUrl, null);

            if (!response.IsSuccessStatusCode)
            {
                return Result<User>.Failure(AuthError.InvalidToken);
            }

            var content = await response.Content.ReadAsStringAsync();
            var validationResponse = JsonSerializer.Deserialize<ExternalValidationResponse>(content, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            if (validationResponse == null)
            {
                return Result<User>.Failure(AuthError.InvalidToken);
            }

            if (validationResponse.Code != 0)
            {
                return Result<User>.Failure(AuthError.InvalidToken);
            }

            if (validationResponse.Result == null || !validationResponse.Result.IsValid)
            {
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
        catch (Exception)
        {
            return Result<User>.Failure(AuthError.InvalidToken);
        }
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
