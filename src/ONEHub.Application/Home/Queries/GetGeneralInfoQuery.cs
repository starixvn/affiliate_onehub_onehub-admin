using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Home;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Home.Queries;

public record GetGeneralInfoQuery : IRequest<GeneralInfoDto?>;

public class GetGeneralInfoQueryHandler(
    IDynamicRepository repository,
    ILogger<GetGeneralInfoQueryHandler> logger)
    : IRequestHandler<GetGeneralInfoQuery, GeneralInfoDto?>
{
    public async Task<GeneralInfoDto?> Handle(
        GetGeneralInfoQuery request,
        CancellationToken cancellationToken)
    {
        try
        {
            var criteria = new GeneralInfoCriteria();
            var result = await repository.GetAsync<GeneralInfoDto>(criteria);
            return result;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error fetching general info");
            return null;
        }
    }
}

