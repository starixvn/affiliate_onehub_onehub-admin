using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.EmailHistory;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.EmailHistory.Queries;

public record GetEmailHistoryDetailQuery(int SelectedEmailId) : IRequest<EmailHistoryDetailInfoDto>;

public class GetEmailHistoryDetailQueryHandler(
    IDynamicRepository repository,
    ILogger<GetEmailHistoryDetailQueryHandler> logger)
    : IRequestHandler<GetEmailHistoryDetailQuery, EmailHistoryDetailInfoDto>
{
    public async Task<EmailHistoryDetailInfoDto> Handle(
        GetEmailHistoryDetailQuery request,
        CancellationToken cancellationToken)
    {
        var result = await repository.FetchAsync<EmailHistoryDetailInfoDto>(new { EmailId = request.SelectedEmailId });
        return result.FirstOrDefault() ?? new EmailHistoryDetailInfoDto();
    }
}

