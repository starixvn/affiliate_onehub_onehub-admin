using ONEHub.Domain.DTOs.Common;
using System.ComponentModel.DataAnnotations;

namespace ONEHub.Domain.DTOs.LandingPages;

public class UpdateLandingPageStatusRequest : UserInfoRequest
{
    [Required]
    public int PageId { get; set; }

    [Range(0, 2, ErrorMessage = "Status is invalid")]
    public byte StatusId { get; set; }
}

