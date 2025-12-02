using System.Net.Http.Json;
using Fanex.Logging;
using ONEHub.Application.Services;

namespace ONEHub.Infrastructure.Services;

public class TriggerJobService(
    HttpClient httpClient,
    ILogger logger) : ITriggerJobService
{
    public async Task TriggerIdCodePushJobAsync()
    {
        try
        {
            var response = await httpClient.PostAsJsonAsync("/api/jobs/trigger/IdCodePushJob", new { });

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                logger.Error($"IDCode Push Job trigger failed with status {response.StatusCode}: {errorContent}");
            }

            var result = await response.Content.ReadFromJsonAsync<JobTriggerResponse>();
            logger.Info($"IDCode Push Job triggered successfully at {result?.TriggeredAt}");
        }
        catch (HttpRequestException ex)
        {
            logger.Error($"HTTP error triggering IDCode Push Job: {ex.Message}");
        }
        catch (TaskCanceledException ex)
        {
            logger.Error($"Timeout triggering IDCode Push Job: {ex.Message}");
        }
        catch (Exception ex)
        {
            logger.Error($"Unexpected error triggering IDCode Push Job: {ex.Message}");
        }
    }
}

public class JobTriggerResponse
{
    public string JobId { get; set; } = string.Empty;
    public string JobName { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public DateTime TriggeredAt { get; set; }
}

