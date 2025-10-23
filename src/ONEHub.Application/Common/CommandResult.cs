namespace ONEHub.Application.Common;

public class CommandResult
{
    public int ErrorCode { get; set; }
    public string ErrorMessage { get; set; } = string.Empty;

    public static CommandResult Success => new() { ErrorCode = 0, ErrorMessage = string.Empty };

    public static CommandResult Error(string message) => new() { ErrorCode = 1, ErrorMessage = message };

    public bool IsSuccess => ErrorCode == 0;
}

public class CommandResult<T>
{
    public int ErrorCode { get; set; }
    public string ErrorMessage { get; set; } = string.Empty;
    public T? Data { get; set; }

    public static CommandResult<T> Success(T data) => new() { ErrorCode = 0, ErrorMessage = string.Empty, Data = data };

    public static CommandResult<T> Error(string message) => new() { ErrorCode = 1, ErrorMessage = message };

    public bool IsSuccess => ErrorCode == 0;
}

