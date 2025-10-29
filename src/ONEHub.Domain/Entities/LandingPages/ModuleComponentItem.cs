using System.ComponentModel.DataAnnotations;

namespace ONEHub.Domain.Entities.LandingPages;

public class ModuleComponentItem
{
    [Required(ErrorMessage = "Module is required")]
    public int ModuleId { get; set; }
    public int? MediaId { get; set; }
    public string ExtraInfo { get; set; }
    public int OrderId { get; set; }
}
