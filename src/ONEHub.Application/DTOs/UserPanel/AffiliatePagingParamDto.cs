using ONEHub.Domain.Constants;
using System.ComponentModel.DataAnnotations;

namespace ONEHub.Application.DTOs.UserPanel;

public class AffiliatePagingParamDto
{
    [Range(Validation.MinId, Validation.MaxId)]
    public int AffId { get; set; }

    public int PageIndex { get; set; }
    public int PageSize { get; set; }
}

