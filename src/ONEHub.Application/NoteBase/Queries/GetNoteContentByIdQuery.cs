using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.UserPanel;
using ONEHub.Domain.Criterias.UserPanel;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.NoteBase.Queries;

public record GetNoteContentByIdQuery(int AffId, int NoteId) : IRequest<NoteBasicInfoDto?>;

public class GetNoteContentByIdQueryHandler(
    IDynamicRepository repository,
    ILogger<GetNoteContentByIdQueryHandler> logger)
    : IRequestHandler<GetNoteContentByIdQuery, NoteBasicInfoDto?>
{
    public async Task<NoteBasicInfoDto?> Handle(
        GetNoteContentByIdQuery request,
        CancellationToken cancellationToken)
    {
        var criteria = new NoteDetailCriteria { AffId = request.AffId, NoteId = request.NoteId };
        return await repository.GetAsync<NoteBasicInfoDto>(criteria);
    }
}

