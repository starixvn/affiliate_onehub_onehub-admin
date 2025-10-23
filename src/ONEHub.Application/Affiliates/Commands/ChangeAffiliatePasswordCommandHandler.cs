using MediatR;
using ONEHub.Domain.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Affiliates.Commands;

public class ChangeAffiliatePasswordCommandHandler : IRequestHandler<ChangeAffiliatePasswordCommand, ResultInfo>
{
    private readonly IDynamicRepository _repository;

    public ChangeAffiliatePasswordCommandHandler(IDynamicRepository repository)
    {
        _repository = repository;
    }

    public async Task<ResultInfo> Handle(ChangeAffiliatePasswordCommand request, CancellationToken cancellationToken)
    {
        var parameters = new
        {
            AffId = request.AffiliateId,
            request.UserId,
            Ip = request.IpAddress,
            request.Password
        };

        var rowsAffected = await _repository.ExecuteAsync(parameters);

        return rowsAffected > 0 ? ResultInfo.Success : ResultInfo.GenerateError("Failed to change password");
    }
}

