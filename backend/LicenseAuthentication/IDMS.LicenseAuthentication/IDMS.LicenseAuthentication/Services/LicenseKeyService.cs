using System.Security.Cryptography;
using System.Text;

namespace IDMS.LicenseAuthentication.Services
{
    public class LicenseKeyService
    {
        private const string AllowedChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

        // Replace with a real secret key from config
        //private readonly string SecretKey = "SuperSecretServerKey123";
        private readonly string _secretKey;

        public LicenseKeyService(string secretKey)
        {
            _secretKey = secretKey ?? throw new ArgumentNullException(nameof(secretKey));
        }

        public string GenerateKey(string inputSecrectKey = "", int payloadLength = 20, int groupSize = 4)
        {
            var finalKey = inputSecrectKey == "" ? _secretKey : inputSecrectKey;    

            string payload = GenerateRandomPayload(payloadLength);
            string checksum = ComputeHmacChecksum(payload, 2, finalKey);
            string fullKey = payload + checksum;
            return FormatWithDashes(fullKey, groupSize);
        }

        public bool ValidateKey(string formattedKey, string inputSecrectKey = "")
        {
            var finalKey = inputSecrectKey == "" ? _secretKey : inputSecrectKey;

            string key = RemoveDashes(formattedKey);
            if (key.Length <= 2) return false;

            string payload = key.Substring(0, key.Length - 2);
            string expectedChecksum = ComputeHmacChecksum(payload, 2, finalKey);
            string actualChecksum = key[^2..];

            return string.Equals(expectedChecksum, actualChecksum, StringComparison.OrdinalIgnoreCase);
        }

        private string GenerateRandomPayload(int length)
        {
            var result = new StringBuilder(length);
            using var rng = RandomNumberGenerator.Create();
            var buffer = new byte[sizeof(uint)];

            while (result.Length < length)
            {
                rng.GetBytes(buffer);
                uint num = BitConverter.ToUInt32(buffer, 0);
                result.Append(AllowedChars[(int)(num % AllowedChars.Length)]);
            }

            return result.ToString();
        }

        private string ComputeHmacChecksum(string input, int length, string secretKey)
        {
            using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(secretKey));
            byte[] hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(input));
            var sb = new StringBuilder(length);

            for (int i = 0; i < length; i++)
                sb.Append(AllowedChars[hash[i] % AllowedChars.Length]);

            return sb.ToString();
        }

        private string FormatWithDashes(string key, int groupSize)
        {
            return string.Join("-", Enumerable.Range(0, key.Length / groupSize)
                .Select(i => key.Substring(i * groupSize, groupSize)));
        }

        private string RemoveDashes(string key)
        {
            return key.Replace("-", "").ToUpperInvariant();
        }
    }
}
