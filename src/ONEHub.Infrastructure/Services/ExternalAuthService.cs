using System.Net.Http.Headers;
using System.Net.Http.Json;
using Fanex.Logging;
using ONEHub.Application.Services;
using ONEHub.Application.Utils;
using ONEHub.Domain.Entities;
using ONEHub.Domain.Errors;
using ONEHub.Domain.Results;

namespace ONEHub.Infrastructure.Services;

public class ExternalAuthService(HttpClient httpClient) : IExternalAuthService
{
    public async Task<Result<User>> ValidateTokenAsync(string authToken)
    {
        try
        {
            using var request = new HttpRequestMessage(HttpMethod.Post, "/api/auth/validate");
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", authToken);
            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var response = await httpClient.SendAsync(request);

            if (!response.IsSuccessStatusCode)
            {
                return Result<User>.Failure(AuthError.InvalidToken);
            }

            var body = await response.Content.ReadFromJsonAsync<ExternalValidationResponse>();

            if (body?.Code == 1004)
            {
                return Result<User>.Failure(AuthError.ExpiredToken);
            }

            if (body is null || body.Code != 0 || body.Result is null || !body.Result.IsValid)
            {
                return Result<User>.Failure(AuthError.InvalidToken);
            }

            return Result<User>.Success(new User
            {
                UserId = body.Result.UserId,
                UserName = body.Result.Username,
                Roles = body.Result.Roles is not null ? string.Join(",", body.Result.Roles) : "",
                Avatar = body.Result.Avatar ?? "",
                IsAdmin = body.Result.IsAdmin,
                PasswordHash = body.Result.PasswordHash
            });
        }
        catch (Exception ex)
        {
            await Logger.Log.ErrorAsync(LoggerUtils.GenerateMessage(ex));
            return Result<User>.Failure(AuthError.InvalidToken);
        }
    }

    public async Task<Result<string>> RefreshTokenAsync(string refreshToken)
    {
        try
        {
            using var request = new HttpRequestMessage(HttpMethod.Post, "/api/auth/refresh");
            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            request.Headers.Add("X-Refresh-Token", refreshToken);

            var response = await httpClient.SendAsync(request);

            if (!response.IsSuccessStatusCode)
            {
                return Result<string>.Failure(AuthError.InvalidToken);
            }

            var body = await response.Content.ReadFromJsonAsync<ExternalRefreshResponse>();

            if (body is null || body.Code != 0 || body.Result is null || string.IsNullOrEmpty(body.Result.AccessToken))
            {
                return Result<string>.Failure(AuthError.InvalidToken);
            }

            return Result<string>.Success(body.Result.AccessToken);
        }
        catch (Exception ex)
        {
            await Logger.Log.ErrorAsync(LoggerUtils.GenerateMessage(ex));
            return Result<string>.Failure(AuthError.InvalidToken);
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
    string PasswordHash,
    List<string>? Roles,
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
