namespace ONEHub.Domain.Errors;
public sealed record ServiceError(int Code, string Message)
{
    public static readonly ServiceError None = new(0, string.Empty);

    // System Errors 99[x]
    public static readonly ServiceError SystemError = new(999, "System error.");
}

