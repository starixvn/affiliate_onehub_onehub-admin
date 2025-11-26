namespace ONEHub.Domain.Entities;

public class PagingData<T> where T : class
{
    public List<T> Items { get; set; } = [];

    public int TotalItem { get; set; }

    public int PageIndex { get; set; }

    public int PageSize { get; set; }
}

public class PagingDataWithDashboard<T, TDashboard> where TDashboard : new()
{
    public IEnumerable<T> Items { get; set; } = [];

    public int TotalItem { get; set; }

    public int PageIndex { get; set; }

    public int PageSize { get; set; }

    public TDashboard Dashboard { get; set; } = new();
}

