namespace ONEHub.Domain.Constants;

public static class GSheetsQueueKeys
{
    public const string QueueIdentify = "onehub.gsheets";

    public const string MainExchangeName = $"{QueueIdentify}.exchange";
    public const string MainQueueName = $"{QueueIdentify}.queue";
    public const string RetryQueueName = $"{QueueIdentify}.retry.queue";
    public const string ErrorQueueName = $"{QueueIdentify}.error.queue";
    public const string RoutingKey = $"{QueueIdentify}.routing";
}
