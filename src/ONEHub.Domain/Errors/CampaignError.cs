namespace ONEHub.Domain.Errors;

public static class CampaignError
{
    // Invalid Errors 20[x]
    public static readonly Error InvalidCampaignId = new(201, "Invalid CampaignId.");

    public static readonly Error CreateCampaignFailed = new(101, "Failed to create campaign.");
}

