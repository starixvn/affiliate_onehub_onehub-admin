namespace ONEHub.Domain.Errors;

public static class LinkError
{
    public static readonly Error InvalidLinkId = new(201, "Invalid LinkId.");
}

