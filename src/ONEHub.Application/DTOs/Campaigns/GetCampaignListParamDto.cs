namespace ONEHub.Application.DTOs.Campaigns
{
    public class GetCampaignListParamDto
    {
        public string Search { get; set; } = string.Empty;
        public string StatusIds { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
        public bool IsExportExcel { get; set; }
    }
}

