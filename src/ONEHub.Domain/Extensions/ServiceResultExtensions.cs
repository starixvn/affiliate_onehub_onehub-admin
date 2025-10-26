using ONEHub.Domain.Errors;
using ONEHub.Domain.Results;

namespace ONEHub.Domain.Extensions;
public static class ServiceResultExtensions
{
    public static T1 Match<T1, T2>(
        this ServiceResult<T2> result,
        Func<T1> onSuccess,
        Func<ServiceError, T1> onFailure) where T1 : class where T2 : class
    {
        return result.IsSuccess ? onSuccess() : onFailure(result.Error);
    }

    public static T1 Match<T1>(
        this ServiceResult result,
        Func<T1> onSuccess,
        Func<ServiceError, T1> onFailure) where T1 : class
    {
        return result.IsSuccess ? onSuccess() : onFailure(result.Error);
    }
}

