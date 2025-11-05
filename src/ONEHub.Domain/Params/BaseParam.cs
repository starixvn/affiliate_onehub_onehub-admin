namespace ONEHub.Domain.Params;

public abstract class BaseParam
{
    public int UserId { get; set; }

    public string Ip { get; set; } = string.Empty;

    public string Host { get; set; } = string.Empty;
}
