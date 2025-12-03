namespace ONEHub.Domain.Params;

public class GSheetsQueueResponse
{
    public bool IsSuccess { get; set; }
    public int ErrorCode { get; set; }
    public string ErrorMessage { get; set; } = string.Empty;
    public string? Data { get; set; }
}

