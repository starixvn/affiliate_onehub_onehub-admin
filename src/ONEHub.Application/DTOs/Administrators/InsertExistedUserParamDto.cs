using ONEHub.Domain.Constants;
using System.ComponentModel.DataAnnotations;

namespace ONEHub.Application.DTOs.Administrators;

public class InsertExistedUserParamDto
{
    public int UserId { get; set; }
    public string Ip { get; set; } = string.Empty;

    [Required(ErrorMessage = "Please input user name!")]
    public string UserName { get; set; } = string.Empty;

    [Range(Validation.MinId, Validation.MaxId, ErrorMessage = "Please choose department!")]
    public int GroupId { get; set; }
}

