using ONEHub.Domain.Interfaces;

namespace ONEHub.Infrastructure.Services;

public class SystemFileService : ISystemFile
{
    public bool FileExists(string filePath)
    {
        return File.Exists(filePath);
    }

    public void DeleteFile(string filePath)
    {
        if (File.Exists(filePath))
        {
            File.Delete(filePath);
        }
    }

    public void MoveFile(string serverPath, string newFilePath, string oldFilePath)
    {
        var oldFullPath = Path.Combine(serverPath, oldFilePath);
        var newFullPath = Path.Combine(serverPath, newFilePath);

        if (File.Exists(oldFullPath))
        {
            var directoryPath = Path.GetDirectoryName(newFullPath);
            if (!string.IsNullOrEmpty(directoryPath) && !Directory.Exists(directoryPath))
            {
                Directory.CreateDirectory(directoryPath);
            }

            File.Move(oldFullPath, newFullPath);
        }
    }

    public void CreateDirectory(string directoryPath)
    {
        if (!Directory.Exists(directoryPath))
        {
            Directory.CreateDirectory(directoryPath);
        }
    }

    public string GetExtension(string fileName)
    {
        return Path.GetExtension(fileName);
    }
}

