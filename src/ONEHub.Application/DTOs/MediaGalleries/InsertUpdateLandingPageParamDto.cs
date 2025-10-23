using ONEHub.Domain.Constants;
using System.ComponentModel.DataAnnotations;

namespace ONEHub.Application.DTOs.MediaGalleries;

public class InsertUpdateLandingPageParamDto
{
    public int UserId { get; set; }
    public string Ip { get; set; } = string.Empty;
    public int PageId { get; set; }

    [Required(ErrorMessage = "Landing Page Name is required.")]
    [MaxLength(Validation.MaxLengthInLandingPage, ErrorMessage = "Page name must not exceed 50 characters.")]
    public string PageName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Landing Page Code is required.")]
    [MaxLength(Validation.MaxLengthInLandingPage, ErrorMessage = "Page code must not exceed 50 characters, without spaces or special characters.")]
    public string PageCode { get; set; } = string.Empty;

    [DisplayFormat(ConvertEmptyStringToNull = false)]
    public string BlockTargetCountry { get; set; } = string.Empty;

    public bool IsMobile { get; set; }
    public bool IsExcluded { get; set; }

    [DisplayFormat(ConvertEmptyStringToNull = false)]
    public string DealIds { get; set; } = string.Empty;
}

