using Microsoft.AspNetCore.Http;

namespace ONEHub.Domain.Params;

public class AssetListParam : PagingParam
{
    public string? MediaName { get; set; } = string.Empty;

    public string? ModuleIds { get; set; } = string.Empty;

    public string? TargetCountryCodes { get; set; } = string.Empty;

    public string? LanguageCodes { get; set; } = string.Empty;

    public int Status { get; set; }

    public int MediaId { get; set; }

    public int UserId { get; set; }

    public string FunctionName { get; set; }
}

public class AssetDetailParam : BaseParam
{
    public int MediaId { get; set; }
}

public class UploadAssetsParam : BaseParam
{
    public string Files { get; set; } = string.Empty;

    public string TargetCountryCode { get; set; } = string.Empty;

    public string LanguageCode { get; set; } = string.Empty;
}

public class UpdateAssetParam : BaseParam
{
    public int MediaId { get; set; }

    public int ModuleId { get; set; }

    public string TargetCountryCode { get; set; } = string.Empty;

    public string LanguageCode { get; set; } = string.Empty;

    public string Files { get; set; } = string.Empty;
}

public class DeleteAssetsParam : BaseParam
{
    public string MediaIds { get; set; } = string.Empty;
}

public class UpdateAssetStatusParam : BaseParam
{
    public string MediaIds { get; set; } = string.Empty;

    public int StatusId { get; set; }
}

public class ModuleRow
{
    public int ModuleId { get; set; }

    public string? InputMediaNames { get; set; }

    public List<IFormFile> Files { get; set; }
}
