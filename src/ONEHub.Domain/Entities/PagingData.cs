namespace ONEHub.Domain.Entities;

public class PagingData<T> where T : class
{
    public List<T> Items { get; set; } = [];

    public int TotalItem { get; set; }

    public int PageIndex { get; set; }

    public int PageSize { get; set; }
}

