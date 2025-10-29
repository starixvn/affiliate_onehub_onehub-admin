using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.UserPanel;
using ONEHub.Domain.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Features.NoteBase.Queries;

public record GetNoteListQuery(AffiliatePagingParamDto Param) : IRequest<EntityResult<NoteInfoDto>>;

public class GetNoteListQueryHandler(
    IDynamicRepository repository,
    ILogger<GetNoteListQueryHandler> logger)
    : IRequestHandler<GetNoteListQuery, EntityResult<NoteInfoDto>>
{
    public async Task<EntityResult<NoteInfoDto>> Handle(
        GetNoteListQuery request,
        CancellationToken cancellationToken)
    {
        var results = await repository.FetchAsync<NoteInfoDto>(request.Param);
        var list = results.ToList();

        return new EntityResult<NoteInfoDto>
        {
            MainData = list,
            TotalItem = list.Count,
            PageIndex = request.Param.PageIndex,
            PageSize = request.Param.PageSize
        };
    }
}

