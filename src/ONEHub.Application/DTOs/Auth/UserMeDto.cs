namespace ONEHub.Application.DTOs.Auth;

public record UserMeDto
{
    public int UserId { get; init; }
    public string UserName { get; init; } = string.Empty;
    public int OnUserId { get; init; }
    public IEnumerable<ClaimDto> Claims { get; init; } = Array.Empty<ClaimDto>();
}

public record ClaimDto
{
    public string Type { get; init; } = string.Empty;
    public string Value { get; init; } = string.Empty;
}
