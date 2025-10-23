namespace ONEHub.Domain.Entities.UserPanels;

public class NoteBasicInfo
{
    public int NoteId { get; set; }
    public string Note { get; set; } = string.Empty;
    public DateTime CreatedDate { get; set; }
}

