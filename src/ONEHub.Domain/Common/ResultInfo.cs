namespace ONEHub.Domain.Common;

public class ResultInfo
{
    public int Code { get; set; }
    public string Message { get; set; } = string.Empty;
    public bool IsSuccessful => Code == 0;

    public ResultInfo() { }

    public ResultInfo(int code, string message)
    {
        Code = code;
        Message = message;
    }

    public static ResultInfo Success => new();

    public static ResultInfo GenerateError(string message = "") => new()
    {
        Code = 1,
        Message = message
    };
}

public class ResultInfo<T> : ResultInfo
{
    public T? Data { get; set; }

    public static ResultInfo<T> SuccessWithData(T data) => new()
    {
        Code = 0,
        Data = data
    };
}

