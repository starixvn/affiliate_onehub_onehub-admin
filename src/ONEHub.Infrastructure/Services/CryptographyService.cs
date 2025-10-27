using ONEHub.Domain.Interfaces;
using ONEHub.Infrastructure.Utilities;

namespace ONEHub.Infrastructure.Services;

public class CryptographyService : ICryptographyService
{
    public string Encrypt(string plainText)
    {
        return CryptographyHelper.Encrypt(plainText);
    }

    public string Decrypt(string encryptedText)
    {
        throw new NotImplementedException("Decrypt is not implemented in CryptographyHelper");
    }
}

