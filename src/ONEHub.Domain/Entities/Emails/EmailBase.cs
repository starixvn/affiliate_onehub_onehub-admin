namespace ONEHub.Domain.Entities.Emails;

public abstract class EmailBase
{
    public string To { get; set; } = string.Empty;
    public string From { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
    public DateTime CreatedDate { get; set; }
}

