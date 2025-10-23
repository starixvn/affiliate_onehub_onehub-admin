using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Operations;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Operations.Queries;

public record GetDealSettingDetailQuery(int GroupId) : IRequest<DealSettingDetailDto?>;

public class GetDealSettingDetailQueryHandler(
    IDynamicRepository repository,
    ILogger<GetDealSettingDetailQueryHandler> logger)
    : IRequestHandler<GetDealSettingDetailQuery, DealSettingDetailDto?>
{
    public async Task<DealSettingDetailDto?> Handle(
        GetDealSettingDetailQuery request,
        CancellationToken cancellationToken)
    {
        var dealSettingInfo = await repository.GetAsync<DealSettingDetailDto>(
            new { GroupId = request.GroupId });

        if (dealSettingInfo == null)
        {
            logger.LogWarning("Deal setting not found for GroupId: {GroupId}", request.GroupId);
            return null;
        }

        var revenueTierSettings = await repository.FetchAsync<RevenueTierSettingDto>(
            new { GroupId = request.GroupId });

        var revenueDeductionSettings = await repository.FetchAsync<RevenueDeductionSettingDto>(
            new { GroupId = request.GroupId });

        var cpaTierSettings = await repository.FetchAsync<CpaTierSettingDto>(
            new { GroupId = request.GroupId });

        var cpaGroupProducts = await repository.FetchAsync<CpaGroupProductDto>(
            new { GroupId = request.GroupId });

        dealSettingInfo.RevenueTierSetting = revenueTierSettings;
        dealSettingInfo.CPATierSetting = cpaTierSettings;
        dealSettingInfo.ProductGroup = cpaGroupProducts;

        const int platformFeeId = 1;
        const int depositFeeId = 2;
        const int withdrawalFeeId = 3;
        const int cpaType = 3;

        if (dealSettingInfo.DealType != cpaType && revenueDeductionSettings.Any())
        {
            var deductionList = revenueDeductionSettings.ToList();
            dealSettingInfo.PlatformFeeSetting = deductionList.Where(p => p.DeductionId == platformFeeId);
            dealSettingInfo.DepositFeeSetting = deductionList.FirstOrDefault(p => p.DeductionId == depositFeeId);
            dealSettingInfo.WithdrawalFeeSetting = deductionList.FirstOrDefault(p => p.DeductionId == withdrawalFeeId);
        }

        return dealSettingInfo;
    }
}

