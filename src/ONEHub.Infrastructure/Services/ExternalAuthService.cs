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

    public async Task<Result<User>> ValidateTokenAsync(string jwtToken)
    {
        try
        {
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", jwtToken);
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

            var user = new User
            {
                UserId = validationResponse.UserId,
                UserName = validationResponse.UserName,
                Roles = validationResponse.Roles,
                Avatar = validationResponse.Avatar ?? string.Empty,
                IsAdmin = validationResponse.IsAdmin,
                PasswordHash = string.Empty
            };

            return Result<User>.Success(user);
        }
        catch (HttpRequestException)
        {
            return Result<User>.Failure(AuthError.InvalidToken);
        }
        catch (TaskCanceledException)
        {
            return Result<User>.Failure(AuthError.InvalidToken);
        }
        catch (Exception)
        {
            return Result<User>.Failure(AuthError.InvalidToken);
        }
    }
}

internal record ExternalValidationResponse(
    int UserId,
    string UserName,
    string Roles,
    string? Avatar,
    bool IsAdmin);
