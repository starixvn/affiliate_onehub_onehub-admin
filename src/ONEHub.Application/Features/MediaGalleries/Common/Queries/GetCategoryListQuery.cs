using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.MediaGalleries;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Features.MediaGalleries.Common.Queries;

public record GetCategoryListQuery(byte TypeId, byte UserType) : IRequest<IEnumerable<CategoryDto>>;

public class GetCategoryListQueryHandler(
    IDynamicRepository repository,
    ILogger<GetCategoryListQueryHandler> logger)
    : IRequestHandler<GetCategoryListQuery, IEnumerable<CategoryDto>>
{
    public async Task<IEnumerable<CategoryDto>> Handle(
        GetCategoryListQuery request,
        CancellationToken cancellationToken)
    {
        var results = await repository.FetchAsync<CategoryDto>(new
        {
            request.TypeId,
            request.UserType
        });
        return results.ToList();
    }
}

