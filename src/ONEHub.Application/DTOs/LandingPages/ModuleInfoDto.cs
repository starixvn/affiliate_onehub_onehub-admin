namespace ONEHub.Application.DTOs.LandingPages;

public class ModuleInfoDto
{
    public int ModuleId { get; set; }
    public string ModuleName { get; set; } = string.Empty;
    public int ModuleType { get; set; }
    public bool IsMultipleUpload { get; set; }
    public bool IsRequired { get; set; }
    public bool IsUnique { get; set; }
}

