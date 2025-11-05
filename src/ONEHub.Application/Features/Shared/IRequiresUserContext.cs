namespace ONEHub.Application.Features.Shared;

public interface IRequiresUserContext
{
    int UserId { get; set; }

    string Ip { get; set; }

    string Host { get; set; }
}
