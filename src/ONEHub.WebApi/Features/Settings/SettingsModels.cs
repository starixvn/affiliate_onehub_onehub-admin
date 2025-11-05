using System.ComponentModel.DataAnnotations;

namespace ONEHub.WebApi.Features.Settings;

public record GetLanguagesRequest([Required] string CountryCode);

