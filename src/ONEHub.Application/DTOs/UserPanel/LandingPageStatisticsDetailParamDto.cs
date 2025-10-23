using ONEHub.Domain.Constants;
using System.ComponentModel.DataAnnotations;

namespace ONEHub.Application.DTOs.UserPanel;

public class LandingPageStatisticsDetailParamDto : LandingPageStatisticsParamDto
{
    [Range(Validation.MinPageIndex, Validation.MaxPageIndex)]
    public int PageIndex { get; set; }

    [Range(Validation.MinPageSize, Validation.MaxPageSize)]
    public int PageSize { get; set; }
}

