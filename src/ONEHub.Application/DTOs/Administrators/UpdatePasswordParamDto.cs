using ONEHub.Domain.Constants;
using System.ComponentModel.DataAnnotations;

namespace ONEHub.Application.DTOs.Administrators;

public class UpdatePasswordParamDto
{
    public int UserId { get; set; }
    public string Ip { get; set; } = string.Empty;

    [Range(Validation.MinId, Validation.MaxId, ErrorMessage = "Account Id is invalid!")]
    public int AccountId { get; set; }

    [Required(ErrorMessage = "Password is required!")]
    [RegularExpression("^(?=.*[0-9]+.*[0-9]+)(?=.*[a-zA-Z].*[a-zA-Z]).{6,}$", ErrorMessage = "Password is invalid!")]
    public string Password { get; set; } = string.Empty;

    [Compare(nameof(Password), ErrorMessage = "Confirm password is incorrect!")]
    public string ConfirmPassword { get; set; } = string.Empty;
}

