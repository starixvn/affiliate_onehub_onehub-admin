using ONEHub.Domain.Common;

namespace ONEHub.Application.Common;

public abstract class PaginatedQuery<TResponse> : BaseQuery<EntityResult<TResponse>> where TResponse : class
{
    public int PageIndex { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public string SortBy { get; set; } = string.Empty;
    public string SortDirection { get; set; } = "ASC";
}

