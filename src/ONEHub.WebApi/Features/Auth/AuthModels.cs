using System.ComponentModel.DataAnnotations;

namespace ONEHub.WebApi.Features.Auth;

public record LoginRequest([Required] string Username, [Required] string Password);
