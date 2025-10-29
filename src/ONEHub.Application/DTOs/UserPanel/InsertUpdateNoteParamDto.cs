using ONEHub.Domain.Constants;
using System.ComponentModel.DataAnnotations;

namespace ONEHub.Application.DTOs.UserPanel;

public class InsertUpdateNoteParamDto
{
    [Range(Validation.MinId, Validation.MaxId)]
    public int AffId { get; set; }

    public int UserId { get; set; }
    public string Ip { get; set; } = string.Empty;
    public int NoteId { get; set; }

    [Required]
    public string NoteContent { get; set; } = string.Empty;
}

