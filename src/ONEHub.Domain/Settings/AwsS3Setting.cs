namespace ONEHub.Domain.Settings;

public class AwsS3Setting
{
    public const string SETTING_NAME = "AwsS3";

    public string AccessKey { get; set; } = string.Empty;

    public string SecretKey { get; set; } = string.Empty;

    public string Region { get; set; } = string.Empty;

    public string BucketName { get; set; } = string.Empty;
}

