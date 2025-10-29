namespace ONEHub.Domain.DTOs.Common;

public class EntityResult<T> where T : class
{
    public IEnumerable<T> MainData { get; set; } = [];
    public T? Total { get; set; }
    public int TotalItem { get; set; }
}

