namespace ONEHub.Domain.Entities;

public class LinkDashboard
{
    public int TotalLinks { get; set; }

    public int TotalClicks { get; set; }

    public int TotalRegistrations { get; set; }

    public int TotalFTDs { get; set; }

    public decimal AvgFTDs { get; set; }

    public int Bonus { get; set; }
}
