namespace ONEHub.Domain.Errors;
public sealed record Error(int Code, string Message)
{
    public static readonly Error None = new(0, string.Empty);

    // Common Errors 0[xx]
    public static readonly Error NoData = new(10, "No data available.");

    // System Errors 99[x]
    public static readonly Error SystemError = new(999, "System error.");
}

