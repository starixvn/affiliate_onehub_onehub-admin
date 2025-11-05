using ONEHub.Domain.Entities;

namespace ONEHub.Application.Features.Shared;

public abstract class PagingQuery<TResponse> : BaseQuery<PagingData<TResponse>> where TResponse : class
{
    public int PageIndex { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public string SortBy { get; set; } = string.Empty;
    public string SortDirection { get; set; } = "ASC";
}

