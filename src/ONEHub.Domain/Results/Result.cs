using System.Text.Json.Serialization;
using ONEHub.Domain.Errors;

namespace ONEHub.Domain.Results;

public class Result
{
    protected Result(Error error)
    {
        ErrorCode = error.Code;
        ErrorMessage = error.Message;
    }

    public int ErrorCode { get; }

    public string ErrorMessage { get; }

    [JsonIgnore]
    public bool IsSuccess => ErrorCode == 0;

    [JsonIgnore]
    public bool IsFailure => !IsSuccess;

    [JsonIgnore]
    public Error Error => new(ErrorCode, ErrorMessage);

    public static Result Success() => new(Error.None);

    public static Result Failure(Error error) => new(error);
}

public class Result<T> : Result where T : class
{
    protected Result(Error error, T? data = null) : base(error)
    {
        Data = data;
    }

    public T? Data { get; }

    public static Result<T> Success(T result) => new(Error.None, result);

    public static new Result<T> Failure(Error error) => new(error);
}
