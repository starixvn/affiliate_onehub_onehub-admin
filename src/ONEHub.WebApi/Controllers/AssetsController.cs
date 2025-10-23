using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;

namespace ONEHub.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AssetsController : ControllerBase
{
    private static readonly Dictionary<string, string> _versionCache = new();
    private static readonly object _cacheLock = new();
    private static DateTime _lastCacheTime = DateTime.MinValue;
    private const int CacheDurationMinutes = 5;

    [HttpGet("versions")]
    public IActionResult GetAssetVersions()
    {
        lock (_cacheLock)
        {
            if ((DateTime.UtcNow - _lastCacheTime).TotalMinutes < CacheDurationMinutes && _versionCache.Count > 0)
            {
                return Ok(_versionCache);
            }

            _versionCache.Clear();
            var webRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");

            var assetPaths = new[]
            {
                "dist/js/pages/login.js",
                "dist/js/pages/home.js",
                "dist/js/pages/landing-page.js",
                "dist/js/pages/campaign-management.js",
                "dist/js/dynamic-chunks/vendors/react-core.chunk.js",
                "dist/js/dynamic-chunks/vendors/redux.chunk.js",
                "dist/js/dynamic-chunks/vendors/toastify.chunk.js",
                "dist/js/dynamic-chunks/vendors/common.chunk.js",
                "dist/js/dynamic-chunks/common.chunk.js",
                "dist/vendors/react.js",
                "dist/vendors/moment.js",
                "dist/vendors/bootstrap.js",
                "vendors/toastify.css",
                "portal/common/common-config.js",
                "portal/common/auth-guard.js",
                "portal/common/page-init.js"
            };

            foreach (var assetPath in assetPaths)
            {
                var filePath = Path.Combine(webRootPath, assetPath.Replace('/', Path.DirectorySeparatorChar));
                
                if (System.IO.File.Exists(filePath))
                {
                    var version = GenerateFileVersion(filePath);
                    _versionCache[$"/{assetPath}"] = version;
                }
            }

            _lastCacheTime = DateTime.UtcNow;
            return Ok(_versionCache);
        }
    }

    private static string GenerateFileVersion(string filePath)
    {
        try
        {
            var fileInfo = new FileInfo(filePath);
            var lastWriteTime = fileInfo.LastWriteTimeUtc;

            using var stream = System.IO.File.OpenRead(filePath);
            using var sha256 = SHA256.Create();
            var hashBytes = sha256.ComputeHash(stream);
            var hash = Convert.ToHexString(hashBytes)[..8];

            return $"{lastWriteTime:yyyyMMddHHmmss}{hash}";
        }
        catch
        {
            return DateTime.UtcNow.Ticks.ToString();
        }
    }

    [HttpPost("clear-cache")]
    public IActionResult ClearCache()
    {
        lock (_cacheLock)
        {
            _versionCache.Clear();
            _lastCacheTime = DateTime.MinValue;
        }
        return Ok(new { message = "Asset version cache cleared" });
    }
}

