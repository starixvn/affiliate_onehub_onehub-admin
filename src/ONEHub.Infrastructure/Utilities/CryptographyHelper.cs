using System.Globalization;
using System.Text;

namespace ONEHub.Infrastructure.Utilities;

public static class CryptographyHelper
{
    private const int NUM = 30;
    private const int TWO = 2;
    private const int TWENTY = 20;
    private const int EIGHT_TEEN = 18;
    private const int SECTION_SIGN_NUMBER = 21;

    public static string Encrypt(string inputString)
    {
        return CfsEnCode(inputString);
    }

    private static string CfsEnCode(string codeStr)
    {
        int num2 = NUM - codeStr.Length;

        var codeBuilder = new StringBuilder();
        codeBuilder.Append(codeStr);
        if (num2 > 1)
        {
            for (int i = 1; i <= num2; i++)
            {
                codeBuilder.Append(Convert.ToChar(SECTION_SIGN_NUMBER));
            }
        }

        var codeString = codeBuilder.ToString();
        double num3 = 1.0;
        for (int j = 1; j <= NUM; j++)
        {
            int num4 = NUM + Convert.ToInt32(Convert.ToChar(codeString.Substring(j - 1, 1))) * j;
            num3 *= num4;
        }
        var num3String = num3.ToString("G15", CultureInfo.InvariantCulture);
        var textBuilder = new StringBuilder();
        for (int k = 1; k <= num3String.Length; k++)
        {
            var length = k + 3 > num3String.Length ? num3String.Length - k + 1 : 3;
            textBuilder.Append(CfsCode(num3String.Substring(k - 1, length)));
        }

        var text = textBuilder.ToString();
        var text2 = new StringBuilder();
        for (int l = TWENTY; l <= text.Length - EIGHT_TEEN; l += TWO)
        {
            text2.Append(text.Substring(l - 1, 1));
        }
        return text2.ToString();
    }

    private static string CfsCode(string nWord)
    {
        var text = new StringBuilder();
        for (int i = 1; i <= nWord.Length; i++)
        {
            text.Append(Convert.ToInt32(Convert.ToChar(nWord.Substring(i - 1, 1))));
        }

        return Convert.ToInt64(text.ToString()).ToString("X");
    }
}

