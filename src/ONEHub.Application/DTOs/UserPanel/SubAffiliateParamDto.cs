using ONEHub.Domain.Constants;
using System.ComponentModel.DataAnnotations;

namespace ONEHub.Application.DTOs.UserPanel;

public class SubAffiliateParamDto
{
    [Range(Validation.MinId, Validation.MaxId)]
    public int AffId { get; set; }

    [Required]
    public DateTime MonthDate { get; set; }

    public int CurrencyId { get; set; }
    public int PageIndex { get; set; }
    public int PageSize { get; set; }
}

