using ONEHub.Domain.Errors;
using ONEHub.Domain.Results;

namespace ONEHub.Domain.Extensions;
public static class ResultExtensions
{
    public static T1 Match<T1, T2>(
        this Result<T2> result,
        Func<T2, T1> onSuccess,
        Func<Error, T1> onFailure) where T1 : class where T2 : class
        => result.IsSuccess && result.Data != null ? onSuccess(result.Data) : onFailure(result.Error);

    public static T1 Match<T1>(
        this Result result,
        Func<T1> onSuccess,
        Func<Error, T1> onFailure) where T1 : class
        => result.IsSuccess ? onSuccess() : onFailure(result.Error);
}

