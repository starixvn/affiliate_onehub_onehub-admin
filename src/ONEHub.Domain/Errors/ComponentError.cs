namespace ONEHub.Domain.Errors;

public static class ComponentError
{
    // Invalid Errors 20[x]
    public static readonly Error InvalidComponentId = new(202, "Invalid ComponentId.");

    public static readonly Error CreateComponentFailed = new(101, "Failed to create component.");
}
