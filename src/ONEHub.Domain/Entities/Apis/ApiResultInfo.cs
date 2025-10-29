namespace ONEHub.Domain.Entities.Apis;

public class ApiResultInfo
{
    public int Code { get; set; }
    public string Message { get; set; } = string.Empty;
    public object? Data { get; set; }
    public bool IsSuccess => Code == 0;
}

