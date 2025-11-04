using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace ONEHub.Domain.DTOs.LandingPages;

public class UpdateAssetRequest
{

    public int MediaId { get; set; }


    public int ModuleId { get; set; }


    public string TargetCountryCode { get; set; } = string.Empty;

    public string LanguageCode { get; set; } = string.Empty;

    public string InputFileName { get; set; } = string.Empty;

    public string InputMediaName { get; set; } = string.Empty;

    public IFormFile? File { get; set; }
}

