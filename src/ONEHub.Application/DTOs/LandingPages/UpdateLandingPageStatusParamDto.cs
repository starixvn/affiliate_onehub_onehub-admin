using ONEHub.Domain.Constants;
using System.ComponentModel.DataAnnotations;

namespace ONEHub.Application.DTOs.LandingPages;

public class UpdateLandingPageStatusParamDto
{
    [Range(Validation.MinId, Validation.MaxId)]
    public int PageId { get; set; }

    public byte StatusId { get; set; }
    public int UserId { get; set; }
    public string Ip { get; set; } = string.Empty;
}

