namespace ONEHub.Application.DTOs.UserPanel;

public class NoteInfoDto : NoteBasicInfoDto
{
    public string CreatedBy { get; set; } = string.Empty;
    public DateTime? LastModify { get; set; }
}

