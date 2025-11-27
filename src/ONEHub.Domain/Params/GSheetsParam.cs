namespace ONEHub.Domain.Params;

public class BaseGSheetsParam
{
    public string SpreadsheetId { get; set; }

    public string SheetsName { get; set; }
}

public class GetGSheetsDataParam : BaseGSheetsParam
{
    public int HeaderRowIndex { get; set; }

    public string Range { get; set; }

    public byte DomainType { get; set; }
}

public class PutGSheetsDataParam : BaseGSheetsParam
{
    public int Row { get; set; }

    public string Column { get; set; }

    public object Value { get; set; }
}

public class CreateGSheetsDomainParam : BaseParam
{
    public string Data { get; set; }

    public byte DomainType { get; set; }

    public byte SiteId { get; set; }
}
