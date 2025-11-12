namespace ONEHub.Application.Features.Shared;

public interface IRequiresUserContext
{
    public int UserId { get; set; }

    public string Ip { get; set; }

    public string Host { get; set; }
}
