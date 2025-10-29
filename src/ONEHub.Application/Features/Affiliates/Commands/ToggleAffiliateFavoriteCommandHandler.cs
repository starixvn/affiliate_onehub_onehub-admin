using MediatR;
using ONEHub.Domain.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Features.Affiliates.Commands;

public class ToggleAffiliateFavoriteCommandHandler : IRequestHandler<ToggleAffiliateFavoriteCommand, ResultInfo>
{
    private readonly IDynamicRepository _repository;

    public ToggleAffiliateFavoriteCommandHandler(IDynamicRepository repository)
    {
        _repository = repository;
    }

    public async Task<ResultInfo> Handle(ToggleAffiliateFavoriteCommand request, CancellationToken cancellationToken)
    {
        var parameters = new
        {
            AffId = request.AffiliateId,
            request.UserId,
            Ip = request.IpAddress,
            request.IsFavorite
        };

        var rowsAffected = await _repository.ExecuteAsync(parameters);

        return rowsAffected > 0 ? ResultInfo.Success : ResultInfo.GenerateError("Failed to toggle favorite");
    }
}

