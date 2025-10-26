namespace ONEHub.WebApi.Models;

public class ApiResponse<T> : IApiResponse<T> where T : class
{
    public int ErrorCode { get; set; }
    public string ErrorMessage { get; set; } = string.Empty;
    public T Result { get; set; } = null!;

    public static ApiResponse<T> Success(T result)
    {
        return new ApiResponse<T>
        {
            ErrorCode = 0,
            ErrorMessage = string.Empty,
            Result = result
        };
    }

    public static ApiResponse<T> Error(int errorCode, string errorMessage)
    {
        return new ApiResponse<T>
        {
            ErrorCode = errorCode,
            ErrorMessage = errorMessage,
            Result = null!
        };
    }
}

public class PagingResponse<T> where T : class
{
    public IEnumerable<T> Items { get; set; } = [];

    public int TotalCount { get; set; }

    public int PageIndex { get; set; }

    public int PageSize { get; set; }
}

public class ApiResponse : IApiResponse
{
    public int ErrorCode { get; set; }
    public string ErrorMessage { get; set; } = string.Empty;

    public static ApiResponse Success()
    {
        return new ApiResponse
        {
            ErrorCode = 0,
            ErrorMessage = string.Empty
        };
    }

    public static ApiResponse Error(int errorCode, string errorMessage)
    {
        return new ApiResponse
        {
            ErrorCode = errorCode,
            ErrorMessage = errorMessage
        };
    }
}
