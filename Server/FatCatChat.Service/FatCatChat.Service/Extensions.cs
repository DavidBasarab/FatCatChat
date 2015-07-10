using System.IO;
using System.Text;

namespace FatCatChat.Service
{
    public static class Extensions
    {
        public static int Clamp(this int value, int maxValue, int minValue)
        {
            if (value > maxValue)
                return maxValue;

            return value < minValue ? minValue : value;
        }

        public static string ConvertToString(this Stream data)
        {
            var reader = new StreamReader(data);

            return reader.ReadToEnd();
        }

        public static int ToInt(this string value, int? defaultValue = null)
        {
            if (!defaultValue.HasValue)
                return int.Parse(value);

            int number;

            return int.TryParse(value, out number) ? number : defaultValue.Value;
        }

        public static long ToLong(this string value, long? defaultValue = null)
        {
            if (!defaultValue.HasValue)
                return long.Parse(value);

            int number;

            return int.TryParse(value, out number) ? number : defaultValue.Value;
        }

        public static Stream ToStream(this string result)
        {
            var results = new MemoryStream();

            results.Write(Encoding.ASCII.GetBytes(result), 0, result.Length);
            results.Position = 0;

            return results;
        }

        public static Stream ToStream(this byte[] result)
        {
            var results = new MemoryStream();

            results.Write(result, 0, result.Length);
            results.Position = 0;

            return results;
        }
    }
}