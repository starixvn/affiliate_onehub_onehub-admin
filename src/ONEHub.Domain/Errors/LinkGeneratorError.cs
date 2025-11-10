namespace ONEHub.Domain.Errors;

public static class LinkGeneratorError
{
    public static readonly Error UniqueCodeGenerationFailed = new(409, "Failed to generate unique short path after maximum attempts.");
}
