using System.ComponentModel.DataAnnotations;

namespace ONEHub.WebApi.Features.AssetUploader;

public record GetAssetListRequest(
    string? MediaName,
    string? ModuleIds,
    string? TargetCountryCodes,
    string? LanguageCodes,
    int Status,
    int PageIndex,
    int PageSize);

public record GetAssetDetailRequest(
    [Required] int MediaId);

public record UploadAssetsRequest(
    [Required] string TargetCountryCode,
    [Required] string LanguageCode,
    List<string>? InputMediaNames,
    List<int> ModuleRows);

public record UpdateAssetRequest(
    [Required] int MediaId,
    [Required] int ModuleId,
    [Required] string TargetCountryCode,
    [Required] string LanguageCode,
    string? InputFileName,
    string? InputMediaName);

public record UpdateAssetStatusRequest(
    [Required] string MediaIds,
    [Required] int StatusId);
