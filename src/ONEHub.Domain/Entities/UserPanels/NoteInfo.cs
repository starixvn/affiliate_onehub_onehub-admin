namespace ONEHub.Domain.Entities.UserPanels;

public class NoteInfo : NoteBasicInfo
{
    public string CreatedBy { get; set; } = string.Empty;
    public DateTime? LastModifyDate { get; set; }
}

