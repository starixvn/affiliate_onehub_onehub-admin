namespace ONEHub.Domain.ValueObjects;

public class ResultInfo
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public object? Data { get; set; }

    public static ResultInfo GenerateSuccess(string message = "", object? data = null)
    {
        return new ResultInfo
        {
            Success = true,
            Message = message,
            Data = data
        };
    }

    public static ResultInfo GenerateErr(string message)
    {
        return new ResultInfo
        {
            Success = false,
            Message = message
        };
    }
}

