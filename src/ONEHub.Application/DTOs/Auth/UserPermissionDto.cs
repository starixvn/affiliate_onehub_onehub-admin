namespace ONEHub.Application.DTOs.Auth;

public record UserPermissionDto
{
    public int FunctionId { get; init; }
    public string FunctionName { get; init; } = string.Empty;
    public int Policy { get; init; }
}

