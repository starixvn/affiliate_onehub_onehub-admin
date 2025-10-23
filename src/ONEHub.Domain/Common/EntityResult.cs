namespace ONEHub.Domain.Common;

public class EntityResult<T> where T : class
{
    public List<T> MainData { get; set; } = new();
    public int TotalItem { get; set; }
    public int PageIndex { get; set; }
    public int PageSize { get; set; }
}

