using ONEHub.Domain.Entities.LandingPages;

namespace ONEHub.Domain.Constants;

public static class LandingPages
{
    public static class FileExtensions
    {
        public static readonly string[] AllImageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
    }

    public static class FileUpload
    {
        public const int MaximumFiles = 50;
        public const int BytesPerKilobyte = 1024;
        public const int MaxFileSizeMegabytes = 3;
        public const int MaxFileSizeBytes = MaxFileSizeMegabytes * BytesPerKilobyte * BytesPerKilobyte; // 3MB
        public const int MaxImageWidth = 2000;
        public const int MaxImageHeight = 5000;
        public const int MaxRequestSizeBytes = 160_000_000; // 160MB (covers 50 files * 3MB + overhead)
    }

    public static class AssetStatusTypes
    {
        public const byte Active = 1;
        public const byte Inactive = 2;
    }

    public static readonly IReadOnlyList<StatusInfo> AssetStatusList = new List<StatusInfo>
    {
        new StatusInfo { StatusId = AssetStatusTypes.Active, Status = "Active" },
        new StatusInfo { StatusId = AssetStatusTypes.Inactive, Status = "Inactive" },
    };
}
