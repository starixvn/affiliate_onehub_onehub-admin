namespace ONEHub.Domain.DTOs.Common;

public class ResultInfo
{
    public ResultInfo() { }

    public ResultInfo(int code, string message)
    {
        Code = code;
        Message = message;
    }

    public int Code { get; set; }
    public string Message { get; set; } = string.Empty;
    public bool IsSuccessful => Code == 0;

    public static ResultInfo Success => new();

    public static ResultInfo GenerateErr(string message = "") => new()
    {
        Code = 1,
        Message = message
    };
}

