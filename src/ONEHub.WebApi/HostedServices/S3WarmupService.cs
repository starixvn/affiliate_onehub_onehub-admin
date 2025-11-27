using System.Net;
using Amazon.S3;
using ONEHub.Application.Services;
using ONEHub.Domain.Settings;

namespace ONEHub.WebApi.HostedServices;

public class S3WarmupService(
    ILogProvider logger,
    IServiceProvider serviceProvider,
    IConfiguration configuration)
    : BackgroundService
{
    private static readonly TimeSpan WarmupInterval = TimeSpan.FromMinutes(3);

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                var s3Setting = configuration.GetSection(AwsS3Setting.SETTING_NAME).Get<AwsS3Setting>();

                if (s3Setting == null || string.IsNullOrWhiteSpace(s3Setting.BucketName))
                {
                    logger.LogFileMessage("[AWS S3] Warm-up skipped: missing bucket configuration.");
                }
                else
                {
                    var s3Client = serviceProvider.GetRequiredService<IAmazonS3>();

                    await WarmUpAsync(s3Client, s3Setting.BucketName, stoppingToken);
                }
            }
            catch (OperationCanceledException)
            {
                logger.LogFileMessage("[AWS S3] Warm-up service cancellation requested.");
                return;
            }
            catch (AmazonS3Exception ex) when (ex.StatusCode == HttpStatusCode.NotFound)
            {
                logger.LogFileMessage("[AWS S3] Warm-up successful (expected 404).");
            }
            catch (AmazonS3Exception ex)
            {
                logger.LogFileError(ex, $"[AWS S3] Warm-up failed (S3 error {ex.StatusCode}): {ex.Message}");
            }
            catch (Exception ex)
            {
                logger.LogFileError(ex, $"[AWS S3] Unexpected warm-up error: {ex.Message}");
            }

            await Task.Delay(WarmupInterval, stoppingToken);
        }
    }

    private async Task WarmUpAsync(IAmazonS3 s3Client, string bucketName, CancellationToken token)
    {
        await s3Client.GetObjectMetadataAsync(bucketName, "warmup-check-key", token);
        logger.LogFileMessage("[AWS S3] Warm-up successful.");
    }
}
