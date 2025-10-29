namespace ONEHub.Domain.Entities.Common;

public class EntityResult<T> where T : class
{
    public IEnumerable<T> MainData { get; set; } = Array.Empty<T>();
    public T? Total { get; set; }
    public int TotalItems { get; set; }
}

