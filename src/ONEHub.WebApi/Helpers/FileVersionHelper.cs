using System.Security.Cryptography;

namespace ONEHub.WebApi.Helpers;

public static class FileVersionHelper
{
    private static readonly Dictionary<string, string> _versionCache = new();
    private static readonly object _lock = new();

    public static string GetVersionedPath(string path, IWebHostEnvironment environment)
    {
        if (string.IsNullOrEmpty(path))
            return path;

        lock (_lock)
        {
            if (_versionCache.TryGetValue(path, out var cachedVersion))
                return cachedVersion;

            var physicalPath = Path.Combine(environment.WebRootPath, path.TrimStart('/'));

            if (!File.Exists(physicalPath))
                return path;

            var lastWriteTime = File.GetLastWriteTimeUtc(physicalPath);
            var version = lastWriteTime.ToString("MMddyyyy_HHmmss");

            var versionedPath = path.Contains('?')
                ? $"{path}&v={version}"
                : $"{path}?v={version}";

            _versionCache[path] = versionedPath;
            return versionedPath;
        }
    }

    public static string GetFileHash(string path, IWebHostEnvironment environment)
    {
        var physicalPath = Path.Combine(environment.WebRootPath, path.TrimStart('/'));

        if (!File.Exists(physicalPath))
            return string.Empty;

        using var md5 = MD5.Create();
        using var stream = File.OpenRead(physicalPath);
        var hash = md5.ComputeHash(stream);
        return Convert.ToHexString(hash)[..8].ToLower();
    }

    public static void ClearCache()
    {
        lock (_lock)
        {
            _versionCache.Clear();
        }
    }
}

