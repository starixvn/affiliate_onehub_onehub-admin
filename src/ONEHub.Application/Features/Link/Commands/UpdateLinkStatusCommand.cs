using MediatR;
using ONEHub.Application.Features.Shared;
using ONEHub.Domain.Params;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Features.Link.Commands;

public class UpdateLinkStatusCommand : BaseNonResultCommand
{
    public int LinkId { get; set; }

    public int StatusId { get; set; }
}

public class UpdateLinkStatusHandler(ILinkRepository linkRepository)
    : IRequestHandler<UpdateLinkStatusCommand, Result>
{
    public async Task<Result> Handle(UpdateLinkStatusCommand request, CancellationToken cancellationToken)
    {
        var param = new UpdateLinkParam
        {
            LinkId = request.LinkId,
            StatusId = request.StatusId,
            UserId = request.UserId,
            Ip = request.Ip,
            Host = request.Host
        };

        var result = await linkRepository.UpdateLinkStatusAsync(param);
        return result;
    }
}

