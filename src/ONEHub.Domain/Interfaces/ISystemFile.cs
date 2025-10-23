namespace ONEHub.Domain.Interfaces;

public interface ISystemFile
{
    bool FileExists(string filePath);
    void DeleteFile(string filePath);
    void MoveFile(string serverPath, string newFilePath, string oldFilePath);
    void CreateDirectory(string directoryPath);
    string GetExtension(string fileName);
}

