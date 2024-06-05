using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CommonUtil.Core.Service
{
    public static class Extensions
    {
        public static IEnumerable<(T item, int index)> WithIndex<T>(this IEnumerable<T> source)
            => source.Select((item, index) => (item, index));

        public static bool EqualsIgnore(this string source, string input)
            => source.Equals(input, StringComparison.OrdinalIgnoreCase);

        public static bool EqualsIgnore(this char source, char input)
            => char.ToLower(source).Equals(char.ToLower(input));

        public static bool IsJson(this string input)
        {
            if (string.IsNullOrEmpty(input)) return false;
            input = input.Trim();
            return (input.StartsWith("{") && input.EndsWith("}")) ||
                   (input.StartsWith("[") && input.EndsWith("]"));
        }

        public static bool ContainsIgnore(this string source, string input)
            => source.Contains(input, StringComparison.OrdinalIgnoreCase);

        public static bool ContainsIgnore(this IEnumerable<string> source, string input)
            => source.Contains(input, StringComparer.InvariantCultureIgnoreCase);

        public static bool JSON_TryParse(this string content, out JObject ReturnObject)
        {
            bool bretval = false;
            ReturnObject = null;
            try
            {
                ReturnObject = JObject.Parse(content);
                if (ReturnObject != null)
                    bretval = true;
            }
            catch
            {
                return false;
            }
            return bretval;
        }

        public static DateTime GetDate(this string input)
        {
            try
            {
                var formatStrings = new string[] { "yyyy-MM-dd", "dd-MM-yyyy", "MM-dd-yyyy", "yyyy/MM/dd", "dd/MM/yyyy", "MM/dd/yyyy", "MM/dd/yyyy hh:mm:ss tt", "yyyy-MM-dd hh:mm:ss", "yyyyMMddHHmmss" };
                if (DateTime.TryParseExact(input, formatStrings, CultureInfo.CurrentCulture, DateTimeStyles.None, out DateTime dateValue))
                    return dateValue;
            }
            catch (Exception ex)
            {
                Util.DisplayConsole($"GetDate exception: {ex}");
            }
            return DateTime.MinValue;
        }

        public static bool IsBase64String(this string s)
        {
            try
            {
                if (string.IsNullOrEmpty(s)) return false;
                byte[] data = Convert.FromBase64String(Util.DecodeUrlString(s));
                return true;
            }
            catch (FormatException)
            {
                return false;
            }
        }

        public static string GetFilename(this string path) => Path.GetFileName(path);

        public static string GetFilenameOnly(this string path) => Path.GetFileNameWithoutExtension(path);

        public static ObservableCollection<T> ToObservableCollection<T>(this IEnumerable<T> col)
        {
            return new ObservableCollection<T>(col);
        }

        public static T GetEnum<T>(this string input)
        {
            try
            {
                return (T)Enum.Parse(typeof(T), input, true);
            }
            catch
            {
                return default(T);
            }
        }

        public static T GetEnum<T>(this int input)
        {
            return input.ToString().GetEnum<T>();
        }

        public static DateTime EpochTimeToDateTime(this long epochTime)
        {
            return new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc).AddSeconds(epochTime).ToLocalTime();
        }

        public static long ToEpochTime(this DateTime date)
        {
            DateTime origin = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
            TimeSpan diff = date.ToUniversalTime() - origin;
            return (long)Math.Floor(diff.TotalSeconds);
        }

        #region JToken
        public static bool IsNullOrEmpty(this JToken token)
        {
            return (token == null) ||
                   (token.Type == JTokenType.Array && !token.HasValues) ||
                   (token.Type == JTokenType.Object && !token.HasValues) ||
                   (token.Type == JTokenType.String && token.ToString() == String.Empty) ||
                   (token.Type == JTokenType.Null);
        }

        public static bool IsArray(this JToken token) => token != null && token.Type == JTokenType.Array;

        public static bool IsObject(this JToken token) => token != null && token.Type == JTokenType.Object;

        public static bool IsString(this JToken token) => token != null && token.Type == JTokenType.String;

        public static bool IsInt(this JToken token) => token != null && token.Type == JTokenType.Integer;

        public static bool ToBool(this JToken token)
        {
            if (token == null)
            {
                return false;
            }

            switch (token.Type)
            {
                case JTokenType.Boolean:
                    return (bool)token;
                case JTokenType.String:
                    if (bool.TryParse(token.ToString(), out bool parsedValue))
                    {
                        return parsedValue;
                    }
                    return false; // or throw an exception, or return another default value
                default:
                    return false; // or throw an exception, or return another default value
            }
        }

        public static int ToInt(this JToken token)
        {
            if (token == null)
            {
                return 0;
            }

            switch (token.Type)
            {
                case JTokenType.Integer:
                    return (int)token;
                case JTokenType.String:
                    if (int.TryParse(token.ToString(), out int parsedValue))
                    {
                        return parsedValue;
                    }
                    return 0; // or throw an exception or return another default value
                default:
                    return 0; // or throw an exception or return another default value
            }
        }

        public static long ToLong(this JToken token) => token != null && token.Type == JTokenType.Integer ? long.Parse($"{token}") : 0;

        public static IEnumerable<JProperty> Properties(this JToken token)
        {
            IEnumerable<JProperty> prop = Enumerable.Empty<JProperty>();
            if (token != null && token.IsObject())
            {
                prop = ((JObject)token).Properties();
            }
            return prop;
        }

        public static List<T> ToArrayList<T>(this JToken token)
        {
            try
            {
                if (!token.IsNullOrEmpty() && token.IsString())
                {
                    return new List<T> { (T)Convert.ChangeType(token, typeof(T)) };
                }
                else if (!token.IsNullOrEmpty() && token.IsArray())
                {
                    return token.Select(x => (T)Convert.ChangeType(x, typeof(T))).ToList();
                }
                else
                {
                    return new List<T>();
                }
            }
            catch
            {
                throw;
            }
        }

        public static IEnumerable<T> ToEnumerable<T>(this JArray jArray)
        {
            try
            {
                IEnumerable<T> ret = Array.Empty<T>();
                foreach (JToken jt in jArray)
                {
                    ret = ret.Append($"{jt}".GetEnum<T>());
                }
                return ret;
            }
            catch
            {
                throw;
            }
        }
        #endregion JToken

        //public static System.Drawing.Bitmap CreateBlankImageWithWhiteBackground(int width, int height)
        //{
        //    System.Drawing.Bitmap bitmap = new System.Drawing.Bitmap(width, height);
        //    try
        //    {
        //        using (System.Drawing.Graphics graphics = System.Drawing.Graphics.FromImage(bitmap))
        //        {
        //            using (System.Drawing.SolidBrush brush = new System.Drawing.SolidBrush(System.Drawing.Color.White))
        //            {
        //                // Fill the entire bitmap with white color
        //                graphics.FillRectangle(brush, 0, 0, width, height);
        //            }
        //        }

        //    }
        //    catch
        //    {
        //        bitmap = new System.Drawing.Bitmap(width, height);

        //    }

        //    return bitmap;
        //}

        //public static string GetBase64String(this System.Drawing.Bitmap bmpImage, System.Drawing.Imaging.ImageFormat format = null)
        //{
        //    string sRetval = "";
        //    try
        //    {
        //        if (bmpImage != null)
        //        {
        //            byte[] bytes = bmpImage.ImageToByte(format);
        //            sRetval = Convert.ToBase64String(bytes);
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        Util.DisplayConsole(ex.Message);
        //    }
        //    return sRetval;
        //}

        //public static byte[] ImageToByte(this System.Drawing.Bitmap bmpImage, System.Drawing.Imaging.ImageFormat format = null)
        //{
        //    using (var stream = new MemoryStream())
        //    {
        //        if (format == null)
        //            format = System.Drawing.Imaging.ImageFormat.Png;
        //        bmpImage.Save(stream, format);
        //        return stream.ToArray();
        //    }
        //}
    }
}
