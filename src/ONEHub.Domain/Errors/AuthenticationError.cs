namespace ONEHub.Domain.Errors;
public static class AuthenticationError
{
    // Authentication Errors 10[x]
    public static readonly ServiceError InvalidCredentials = new(101, "Invalid username or password.");

    public static readonly ServiceError UserNotFound = new(102, "User not found.");

    public static readonly ServiceError UserAlreadyExists = new(103, "User already exists.");

    public static readonly ServiceError InvalidToken = new(104, "Invalid or expired token.");

    public static readonly ServiceError Unauthorized = new(105, "Unauthorized access.");
}

