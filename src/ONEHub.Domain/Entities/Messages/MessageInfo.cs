using ONEHub.Domain.Common;

namespace ONEHub.Domain.Entities.Messages;

public class MessageInfo : BaseEntity, IAuditableEntity
{
    public int MessageId { get; set; }
    public string Creator { get; set; } = string.Empty;
    public string MessageEnglish { get; set; } = string.Empty;
    public bool IsImportant { get; set; }
    public string UpdatedBy { get; set; } = string.Empty;
    public DateTime? PostedDate { get; set; }
    public DateTime? UpdatedDate { get; set; }
    public string CreatedBy { get; set; } = string.Empty;
    public string ModifiedBy { get; set; } = string.Empty;
}

