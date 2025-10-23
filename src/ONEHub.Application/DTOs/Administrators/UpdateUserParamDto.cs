using ONEHub.Domain.Constants;
using System.ComponentModel.DataAnnotations;

namespace ONEHub.Application.DTOs.Administrators;

public class UpdateUserParamDto
{
    public int UserId { get; set; }
    public string Ip { get; set; } = string.Empty;

    [Range(Validation.MinId, Validation.MaxId, ErrorMessage = "Account Id is invalid!")]
    public int AccountId { get; set; }

    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;

    [Range(Validation.MinId, Validation.MaxId, ErrorMessage = "Please choose department!")]
    public int GroupId { get; set; }
}

