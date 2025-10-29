namespace ONEHub.Application.DTOs.Affiliates;

public record AffTypeDto
{
    public int AffiliateTypeId { get; init; }
    public string AffiliateTypeName { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
}

