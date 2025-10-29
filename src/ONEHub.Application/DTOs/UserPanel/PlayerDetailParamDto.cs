using ONEHub.Domain.Constants;
using System.ComponentModel.DataAnnotations;

namespace ONEHub.Application.DTOs.UserPanel;

public class PlayerDetailParamDto
{
    [Range(Validation.MinId, Validation.MaxId)]
    public int AffId { get; set; }

    public int PageIndex { get; set; }
    public int PageSize { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
    public byte ProductId { get; set; }
    public int BaseCurrencyId { get; set; }
    public bool IsExportExcel { get; set; }
    public bool IsSortAsc { get; set; }
    public bool IsIncludeRemovedPlayer { get; set; }
    public int SortById { get; set; } = 5;
    public string CurrencyIds { get; set; } = string.Empty;
}

