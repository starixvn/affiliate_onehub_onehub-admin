namespace ONEHub.Application.DTOs.Auth;

public class MenuDto
{
    public string Key { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public List<SubmenuDto>? Submenus { get; set; }
}

public class SubmenuDto
{
    public string Key { get; set; } = string.Empty;
    public string Controller { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
}

