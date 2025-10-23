using System.ComponentModel.DataAnnotations;

namespace ONEHub.Domain.Entities.LandingPages;

public class MediaSourceParam
{
    public int ModuleId { get; set; }

    [DisplayFormat(ConvertEmptyStringToNull = false)]
    public string TargetCountryCode { get; set; }

    [DisplayFormat(ConvertEmptyStringToNull = false)]
    public string LanguageCode { get; set; }
}

