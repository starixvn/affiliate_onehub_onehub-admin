using System.Globalization;

namespace ONEHub.Application.Utils;

public static class DateTimeUtils
{
    private const string DATE_FORMAT_TEMPLATE = "yyyy-MM-dd";

    public static string FormatDateString(DateTime date)
        => date.ToString(DATE_FORMAT_TEMPLATE, CultureInfo.InvariantCulture);
}
