using ONEHub.Domain.Constants;
using System.ComponentModel.DataAnnotations;

namespace ONEHub.Application.DTOs.Customer
{
    public class CustomerStatisticsParamDto
    {
        [Range(Validation.MinId, Validation.MaxId)]
        public int AffId { get; set; }

        [Required]
        public DateTime? MonthDate { get; set; }
    }
}

