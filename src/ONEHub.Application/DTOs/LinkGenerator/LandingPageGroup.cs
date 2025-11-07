using ONEHub.Domain.Entities;

namespace ONEHub.Application.DTOs.LinkGenerator;

public class LandingPageGroup
{
    public string GroupLabel { get; set; } = string.Empty;

    public IEnumerable<LandingPageOption> Options { get; set; } = [];
}

