using MediatR;
using ONEHub.Domain.Entities;
using ONEHub.Domain.Errors;
using ONEHub.Domain.Params;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Features.Domain.Queries;

public class GetDomainListQuery : IRequest<Result<IEnumerable<DomainInfo>>>
{
    public string CountryCode { get; set; } = string.Empty;

    public int DomainType { get; set; }
}

public class GetDomainListQueryHandler(IDomainRepository repository)
    : IRequestHandler<GetDomainListQuery, Result<IEnumerable<DomainInfo>>>
{
    private const int DEFAULT_SITE_ID = 101;

    public async Task<Result<IEnumerable<DomainInfo>>> Handle(
        GetDomainListQuery request,
        CancellationToken cancellationToken)
    {
        var param = new GetDomainParam
        {
            CountryCode = request.CountryCode,
            DomainType = request.DomainType,
            SiteId = DEFAULT_SITE_ID
        };

        var domainListResult = await repository.GetDomainListAsync(param);

        if (domainListResult.IsFailure)
        {
            return Result<IEnumerable<DomainInfo>>.Failure(domainListResult.Error);
        }

        if (domainListResult.Data is null)
        {
            return Result<IEnumerable<DomainInfo>>.Failure(Error.NoData);
        }

        return Result<IEnumerable<DomainInfo>>.Success(domainListResult.Data);
    }
}

