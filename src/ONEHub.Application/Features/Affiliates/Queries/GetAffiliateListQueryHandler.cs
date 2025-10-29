using MediatR;
using ONEHub.Application.DTOs.Affiliates;
using ONEHub.Domain.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Features.Affiliates.Queries;

public class GetAffiliateListQueryHandler : IRequestHandler<GetAffiliateListQuery, EntityResult<AffiliateDto>>
{
    private readonly IDynamicRepository _repository;

    public GetAffiliateListQueryHandler(IDynamicRepository repository)
    {
        _repository = repository;
    }

    public async Task<EntityResult<AffiliateDto>> Handle(GetAffiliateListQuery request, CancellationToken cancellationToken)
    {
        var criteria = new
        {
            AffCode = request.AffiliateCode,
            request.UserId,
            request.GroupIds,
            request.TargetCountryCode,
            PreferredLanguage = request.LanguageCode,
            request.Status,
            ParentAffName = request.ParentAffiliateName,
            request.UserName,
            request.Email,
            SortType = request.SortBy,
            SortDirectionType = request.SortDirection,
            request.IsExportExcel,
            request.PageIndex,
            request.PageSize,
            request.AffCategoryIds
        };

        var results = await _repository.FetchAsync<AffiliateDto>(criteria);
        var affiliates = results.ToList();

        return new EntityResult<AffiliateDto>
        {
            MainData = affiliates,
            TotalItem = affiliates.Count,
            PageIndex = request.PageIndex,
            PageSize = request.PageSize
        };
    }
}

