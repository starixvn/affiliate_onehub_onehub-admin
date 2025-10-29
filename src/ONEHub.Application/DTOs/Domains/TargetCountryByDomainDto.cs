namespace ONEHub.Application.DTOs.Domains
{
    public class TargetCountryByDomainDto
    {
        public int TargetCountryId { get; set; }
        public string CountryName { get; set; } = string.Empty;
        public string CountryCode { get; set; } = string.Empty;
        public bool IsBlocked { get; set; }
    }
}
