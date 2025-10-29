using ONEHub.Domain.Entities.LandingPages;

namespace ONEHub.Domain.Constants;

public static class LandingPageConstants
{
    public static class ModuleIds
    {
        public const int RegistrationForm = 9;
    }

    public static class FileUpload
    {
        public const int MaximumFiles = 10;
        public const int MaxFileSizeMegabytes = 5;
    }

    public static class FileExtensions
    {
        public const string AllImageExtensions = ".jpg,.jpeg,.png,.gif,.webp";
    }

    public static readonly List<StatusInfo> AssetStatusList =
    [
        new StatusInfo { StatusId = 1, Status = "Active" },
        new StatusInfo { StatusId = 2, Status = "Inactive" }
    ];

    public static class LandingPageStatusTypes
    {
        public const int Draft = 1;
        public const int Active = 2;
        public const int Inactive = 3;
    }

    public static class CampaignStatusTypes
    {
        public const int Active = 1;
        public const int Inactive = 2;
    }
}

