namespace ONEHub.Domain.Errors;
public sealed record ServiceError(int Code, string Message)
{
    public static readonly ServiceError None = new(0, string.Empty);

    // Authentication Errors 40[x]
    public static readonly ServiceError InvalidRefreshToken = new(401, "Invalid or expired refresh token");
    public static readonly ServiceError RefreshTokenNotFound = new(401, "Refresh token not found");
    public static readonly ServiceError RefreshTokenExpired = new(401, "Refresh token has expired");
    public static readonly ServiceError RefreshTokenRevoked = new(401, "Refresh token has been revoked");
    public static readonly ServiceError UserNotFound = new(401, "User not found");

    // System Errors 99[x]
    public static readonly ServiceError SystemError = new(999, "System error.");
}

