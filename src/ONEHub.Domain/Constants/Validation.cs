namespace ONEHub.Domain.Constants;

public static class Validation
{
    public const int MinId = 1;
    public const int MaxId = int.MaxValue;
    public const int MinPageIndex = 1;
    public const int MaxPageIndex = int.MaxValue;
    public const int MinPageSize = 1;
    public const int MaxPageSize = 500;
    public const int MinSearchBy = 0;
    public const int MaxSearchBy = int.MaxValue;

    public const long InfinityAmount = 100_000_000_000;
    public const long NegativeInfinityAmount = -100_000_000_000;
    public const int InfinityQualifiedMember = 1_000_000_000;

    public const int MinAffType = 2;
    public const int MaxAffType = 4;

    public const int MaxLengthCommGroupDescription = 100;
    public const int MaxLengthInLandingPage = 50;

    public const int OnlyOneRow = 1;

    public const int Zero = 0;
    public const int MaxPercentage = 1;

    public const int MaxLengthInputId = 9;
    public const int MaxLengthInputString = 30;

    public const int Hundred = 100;
}

public static class Money
{
    public const long AllowedMaxValue = 100_000_000_000;
}

