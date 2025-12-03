using ONEHub.Domain.Enums;

namespace ONEHub.Domain.Params;

public class GSheetsQueueParam
{
    public string RequestId => $"GSheets-GSheetType:{GSheetType}-{ActionType.ToString()}-{DateTimeOffset.Now.ToString()}";

    public GSheetActionType ActionType { get; set; } = GSheetActionType.Get;

    public int GSheetType { get; set; }

    public string DomainName { get; set; }

    public string Note { get; set; }

    public int Priority { get; set; }
}
