namespace ONEHub.Domain.Entities;

public class LinkManagement
{
    public PagingData<LinkInfo> Links { get; set; } = new();

    public LinkDashboard Dashboard { get; set; } = new();
}
