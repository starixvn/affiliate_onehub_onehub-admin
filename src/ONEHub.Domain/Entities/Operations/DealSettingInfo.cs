using ONEHub.Domain.Common;

namespace ONEHub.Domain.Entities.Operations;

public class DealSettingInfo : BaseEntity
{
    public int GroupId { get; set; }
    public string DealName { get; set; } = string.Empty;
    public int DealType { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal SubCommissionRate { get; set; }
    public decimal QualifiedMemberTurnover { get; set; }
    public string CountryCodes { get; set; } = string.Empty;
    public short ActiveDays { get; set; }
    public short HoldingDays { get; set; }
    public short HoldingTickets { get; set; }
    public short Quota { get; set; }
    public bool IsActivePlayerSum { get; set; }
    public short RedepositDays { get; set; }
    public decimal RedepositRate { get; set; }
    public DateTime? StartDate { get; set; }
    public byte ScheduleId { get; set; }
}

