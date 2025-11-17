namespace ONEHub.Domain.Entities;

public class LinkDashboard
{
    public int TotalLinks { get; set; }

    public int UniqueClicks { get; set; }

    public int TotalRegistrations { get; set; }

    public int TotalFtds { get; set; }

    public decimal AvgFTDs { get; set; }
}

