namespace ONEHub.Domain.Errors;
public static class AuthError
{
    // Authentication Errors 10[x]
    public static readonly Error InvalidCredentials = new(101, "Invalid username or password.");

    public static readonly Error UserNotFound = new(102, "User not found.");

    public static readonly Error UserAlreadyExists = new(103, "User already exists.");

    public static readonly Error InvalidToken = new(104, "Invalid or expired token.");

    public static readonly Error Unauthorized = new(105, "Unauthorized access.");
}

