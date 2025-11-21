using System.ComponentModel.DataAnnotations;

namespace ONEHub.WebApi.Features.LandingPage;

public record GetAssetListRequest(
    string MediaName,
    [Required] string ModuleIds,
    [Required] string LanguageCodes = "all",
    [Required] int Status = 1,
    [Required] int PageIndex = 1,
    [Required] int PageSize = 20,
    [Required] string TargetCountryCodes = "all");

public record GetAssetDetailRequest(
    [Required] int MediaId);

public record UploadAssetsRequest(
    [Required] string TargetCountryCode,
    [Required] string LanguageCode,
    List<string>? InputMediaNames,
    [Required] List<int> ModuleRows);

public record UpdateAssetRequest(
    [Required] int MediaId,
    [Required] int ModuleId,
    [Required] string TargetCountryCode,
    [Required] string LanguageCode,
    [Required] string InputFileName,
    [Required] string InputMediaName);

public record UpdateAssetStatusRequest(
    [Required] string MediaIds,
    [Required] int StatusId);

public record DeleteAssetRequest(
    [Required] string MediaIds
);
