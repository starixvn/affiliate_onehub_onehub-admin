namespace ONEHub.Domain.Errors;

public static class AssetUploaderError
{
    public static readonly Error UpdateAssetFailed = new(101, "Failed to update asset.");

    public static readonly Error UploadAssetsFailed = new(102, "Failed to upload assets.");

    public static readonly Error DeleteAssetsFailed = new(103, "Failed to delete assets.");

    public static readonly Error ChangeAssetStatusFailed = new(104, "Failed to change asset status.");

    public static readonly Error FileAlreadyExists = new(105,
        "A file with this name {0} already exists on the server. Please use a different name.");
}
