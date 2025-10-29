using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.UserPanel;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Features.ViewLog.Queries;

public record GetLogTypeListQuery : IRequest<IEnumerable<LogTypeDto>>;

public class GetLogTypeListQueryHandler(
    IDynamicRepository repository,
    ILogger<GetLogTypeListQueryHandler> logger)
    : IRequestHandler<GetLogTypeListQuery, IEnumerable<LogTypeDto>>
{
    public async Task<IEnumerable<LogTypeDto>> Handle(
        GetLogTypeListQuery request,
        CancellationToken cancellationToken)
    {
        return await repository.FetchAsync<LogTypeDto>(new { });
    }
}

