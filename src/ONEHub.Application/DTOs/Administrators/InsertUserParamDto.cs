using ONEHub.Domain.Constants;
using System.ComponentModel.DataAnnotations;

namespace ONEHub.Application.DTOs.Administrators;

public class InsertUserParamDto
{
    public int UserId { get; set; }
    public string Ip { get; set; } = string.Empty;

    [Required(ErrorMessage = "Please input user name!")]
    public string UserName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Password is required!")]
    public string Password { get; set; } = string.Empty;

    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;

    [Range(Validation.MinId, Validation.MaxId, ErrorMessage = "Please choose department!")]
    public int GroupId { get; set; }
}

