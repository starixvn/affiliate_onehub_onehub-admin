using Microsoft.AspNetCore.Http;

namespace ONEHub.Domain.Interfaces;

public interface IStorageService
{
    Task<bool> UploadFileAsync(IFormFile file, string key);

    Task<bool> DeleteFileAsync(string key);

    Task<bool> FileExistsAsync(string key);
}
