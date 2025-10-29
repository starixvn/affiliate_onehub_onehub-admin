using MediatR;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Features.Affiliates.Commands;

public class CreateMarketingAccountCommandHandler : IRequestHandler<CreateMarketingAccountCommand, int>
{
    private readonly IDynamicRepository _repository;

    public CreateMarketingAccountCommandHandler(IDynamicRepository repository)
    {
        _repository = repository;
    }

    public async Task<int> Handle(CreateMarketingAccountCommand request, CancellationToken cancellationToken)
    {
        var result = await _repository.ExecuteAsync(new
        {
            request.UserId,
            request.AffiliateType,
            request.Password,
            request.GroupId,
            request.FirstName,
            request.LastName,
            request.Gender,
            request.Email,
            request.Phone,
            request.ContactApps,
            request.Address,
            request.City,
            request.State,
            request.Postcode,
            request.Country,
            request.SiteUrl,
            request.MoreSiteUrls,
            request.NoSiteDescription,
            request.PreferredLanguage,
            request.QuestionId,
            request.Answer,
            request.PreferredPayment,
            request.PlayerCustomerId,
            request.PlayerUsername,
            request.PlayerCurrencyId,
            request.IpAddress,
            request.TargetCountryCode
        });

        return result;
    }
}

