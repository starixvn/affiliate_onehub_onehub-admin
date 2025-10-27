namespace ONEHub.Domain.Interfaces;

public interface ICryptographyService
{
    string Encrypt(string plainText);
    string Decrypt(string encryptedText);
}

