using System.ComponentModel.DataAnnotations;

namespace ONEHub.WebApi.Features.Domain;

public record GetDomainListRequest(
    [Required] string CountryCode,
    int DomainType
);

