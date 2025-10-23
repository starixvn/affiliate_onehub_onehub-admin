namespace ONEHub.Application.DTOs.Auth;

public record CurrentUserDto
{
    public int UserId { get; init; }
    public string UserName { get; init; } = string.Empty;
    public string FirstName { get; init; } = string.Empty;
    public string LastName { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public int GroupId { get; init; }
    public string GroupName { get; init; } = string.Empty;
    public IEnumerable<UserPermissionDto> Permissions { get; init; } = Array.Empty<UserPermissionDto>();
}

