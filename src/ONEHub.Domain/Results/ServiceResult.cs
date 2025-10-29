using Newtonsoft.Json;
using ONEHub.Domain.Errors;

namespace ONEHub.Domain.Results;
public class ServiceResult
{
    protected ServiceResult(bool isSuccess, ServiceError error)
    {
        if ((isSuccess && error != ServiceError.None) ||
            (!isSuccess && error == ServiceError.None))
        {
            throw new ArgumentException("Invalid error", nameof(error));
        }

        IsSuccess = isSuccess;
        Error = error;
    }

    [JsonIgnore]
    public bool IsSuccess { get; }

    [JsonIgnore]
    public bool IsFailure => !IsSuccess;

    public ServiceError Error { get; }

    public static ServiceResult Success() => new(true, ServiceError.None);

    public static ServiceResult Failure(ServiceError error) => new(false, error);
}

public class ServiceResult<T>(bool isSuccess, ServiceError error, T result)
    : ServiceResult(isSuccess, error)
    where T : class
{
    public T Result { get; } = result;

    public static ServiceResult<T> Success(T result) => new(true, ServiceError.None, result);

    public new static ServiceResult<T> Failure(ServiceError error) => new(false, error, default);

    public static ServiceResult<T> FailureWithData(ServiceError error, T result) => new(false, error, result);
}


