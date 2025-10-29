using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace ONEHub.Domain.DTOs.LandingPages;

public class UploadAssetsRequest
{
    [Required(ErrorMessage = "Target Country is required")]
    public string TargetCountryCode { get; set; } = string.Empty;

    [Required(ErrorMessage = "Language is required")]
    public string LanguageCode { get; set; } = string.Empty;

    public List<ModuleRow> ModuleRows { get; set; }
}

public class ModuleRow
{
    [Required(ErrorMessage = "Module Id is required")]
    public int ModuleId { get; set; }

    public IFormFileCollection Files { get; set; }
}
