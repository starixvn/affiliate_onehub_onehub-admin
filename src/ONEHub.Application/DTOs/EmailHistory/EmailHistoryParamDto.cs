using ONEHub.Domain.Constants;
using System.ComponentModel.DataAnnotations;

namespace ONEHub.Application.DTOs.EmailHistory
{
    public class EmailHistoryParamDto
    {
        [Range(Validation.MinSearchBy, Validation.MaxSearchBy)]
        public int SearchById { get; set; }

        public bool IsGetAll { get; set; }
        public string SearchText { get; set; } = string.Empty;

        [Required]
        public DateTime FromDate { get; set; }

        [Required]
        public DateTime ToDate { get; set; }

        [Range(Validation.MinPageIndex, Validation.MaxPageIndex)]
        public int PageIndex { get; set; }

        [Range(Validation.MinPageSize, Validation.MaxPageSize)]
        public int PageSize { get; set; }
    }
}

