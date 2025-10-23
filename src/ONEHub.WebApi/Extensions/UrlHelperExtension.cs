using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Mvc;

namespace ONEHub.WebApi.Extensions;

public static class UrlHelperExtension
{
    private static readonly Dictionary<string, string> _versionCache = new();
    private static readonly object _cacheLock = new();

    public static string VersionedLink(this IUrlHelper urlHelper, string virtualPath)
    {
        var contentPath = urlHelper.Content(virtualPath);
        var version = GetFileVersion(contentPath);
        return $"{contentPath}?v={version}";
    }

    private static string GetFileVersion(string contentPath)
    {
        lock (_cacheLock)
        {
            if (_versionCache.TryGetValue(contentPath, out var cachedVersion))
            {
                return cachedVersion;
            }

            var version = GenerateFileVersion(contentPath);
            _versionCache[contentPath] = version;
            return version;
        }
    }

    private static string GenerateFileVersion(string contentPath)
    {
        try
        {
            var webRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            var filePath = Path.Combine(webRootPath, contentPath.TrimStart('/', '\\'));

            if (!File.Exists(filePath))
            {
                return DateTime.UtcNow.Ticks.ToString();
            }

            var fileInfo = new FileInfo(filePath);
            var lastWriteTime = fileInfo.LastWriteTimeUtc;
            
            using var stream = File.OpenRead(filePath);
            using var sha256 = SHA256.Create();
            var hashBytes = sha256.ComputeHash(stream);
            var hash = Convert.ToHexString(hashBytes)[..8];

            return $"{lastWriteTime:yyyyMMddHHmmss}_{hash}";
        }
        catch
        {
            return DateTime.UtcNow.Ticks.ToString();
        }
    }

    public static void ClearVersionCache()
    {
        lock (_cacheLock)
        {
            _versionCache.Clear();
        }
    }
}

