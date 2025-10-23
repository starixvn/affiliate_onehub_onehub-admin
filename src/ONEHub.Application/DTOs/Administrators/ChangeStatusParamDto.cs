using ONEHub.Domain.Constants;
using System.ComponentModel.DataAnnotations;

namespace ONEHub.Application.DTOs.Administrators;

public class ChangeStatusParamDto
{
    public int UserId { get; set; }
    public string Ip { get; set; } = string.Empty;

    [Range(Validation.MinId, Validation.MaxId)]
    public int SelectedUserId { get; set; }

    public bool IsOpen { get; set; }
}

