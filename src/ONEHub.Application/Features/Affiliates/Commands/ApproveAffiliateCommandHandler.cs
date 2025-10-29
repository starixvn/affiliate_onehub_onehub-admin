using MediatR;
using ONEHub.Domain.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Features.Affiliates.Commands;

public class ApproveAffiliateCommandHandler : IRequestHandler<ApproveAffiliateCommand, ResultInfo<string>>
{
    private readonly IDynamicRepository _repository;

    public ApproveAffiliateCommandHandler(IDynamicRepository repository)
    {
        _repository = repository;
    }

    public async Task<ResultInfo<string>> Handle(ApproveAffiliateCommand request, CancellationToken cancellationToken)
    {
        var parameters = new
        {
            AffId = request.AffiliateId,
            request.UserId,
            Ip = request.IpAddress,
            request.Status,
            request.Password
        };

        var rowsAffected = await _repository.ExecuteAsync(parameters);

        if (rowsAffected > 0)
            return ResultInfo<string>.SuccessWithData("Affiliate approved successfully");

        return new ResultInfo<string>
        {
            Code = 1,
            Message = "Failed to approve affiliate"
        };
    }
}

