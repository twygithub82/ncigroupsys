using System.Collections;
using System.ComponentModel;
using System.Diagnostics;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Net;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Text;
using System.Text.RegularExpressions;
using Microsoft.VisualBasic;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using static System.Net.Mime.MediaTypeNames;

namespace CommonUtil.Core.Service
{
    public static class Util
    {
        //[DllImport("user32.dll", SetLastError = true)]
        //public static extern bool SetForegroundWindow(IntPtr hWnd);

        //[DllImport("kernel32.dll", EntryPoint = "RtlCopyMemory", SetLastError = false)]
        //public static extern void CopyMemory(IntPtr dest, IntPtr src, uint count);

        private static object token = new object();

        public static Color StringToColor(string colorStr)
        {
            TypeConverter cc = TypeDescriptor.GetConverter(typeof(Color));
            var result = (Color)cc.ConvertFromString(colorStr);
            return result;
        }

        public static void DisplayConsole(string Message)
        {
            try
            {
                Console.WriteLine($"{DateTime.Now:HH:mm:ss.fff} : {Message}");
            }
            catch (Exception ex)
            { }
        }

        public static T GetConfiguration<T>(string path, string attribute, T defaultvalue, string filePath)
        {
            try
            {
                var jsn = LoadJsonConfigurationFile(filePath);
                var tkn = jsn?.SelectToken(path);

                if (tkn != null)
                {
                    if (!string.IsNullOrEmpty(attribute))
                    {
                        var attributeToken = tkn[attribute];
                        if (attributeToken != null)
                        {
                            return attributeToken.ToObject<T>();
                        }
                    }
                    else
                    {
                        return tkn.ToObject<T>();
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
            return defaultvalue;
        }

        public static JToken LoadJsonConfigurationFile(string path)
        {
            JToken jsn = null;
            string absolute = "";
            try
            {
                absolute = Path.GetDirectoryName($"{Assembly.GetEntryAssembly()?.Location}") + "/" + path;
                if (!File.Exists(absolute)) return jsn;
                using (StreamReader file = File.OpenText(absolute))
                {
                    jsn = JToken.Parse(file.ReadToEnd());
                }
            }
            catch (Exception ex)
            {
                DisplayConsole($"LoadJsonConfigurationFile exception: {ex}, path: {absolute}");
                throw;
            }
            return jsn;
        }

        public static JObject ExcludeJObjectVariables(JObject jo, JArray ja)
        {
            JObject processedJo = new JObject(jo);
            foreach (JToken jt in ja)
            {
                var propertyName = jt.ToString();
                var propertyToRemove = processedJo.Properties().FirstOrDefault(p => p.Name.EqualsIgnore(propertyName));

                propertyToRemove?.Remove();
            }
            return processedJo;
        }

        public static async Task<(HttpStatusCode, string)> RestCallAsync(string url, HttpMethod httpMethod, string payload = "", bool skipCertValidation = false, double timeout = 10000)
        {
            var responseCode = HttpStatusCode.NotFound;
            var responseMsg = string.Empty;
            try
            {
                var handler = new HttpClientHandler()
                {
                    ServerCertificateCustomValidationCallback = (sender, cert, chain, sslPolicyErrors) => skipCertValidation
                };

                using (var client = new HttpClient(handler))
                {
                    client.Timeout = TimeSpan.FromSeconds(timeout / 1000);
                    HttpRequestMessage request = new HttpRequestMessage
                    {
                        Method = httpMethod,
                        RequestUri = new Uri(url),
                    };

                    if (payload != null)
                    {
                        HttpContent c = new StringContent(payload, Encoding.UTF8, "application/json");
                        request.Content = c;
                    }

                    HttpResponseMessage result = await client.SendAsync(request);
                    if (result.IsSuccessStatusCode)
                    {
                        responseCode = result.StatusCode;
                        using (HttpContent content = result.Content)
                        {
                            responseMsg = await content.ReadAsStringAsync().ConfigureAwait(false);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                DisplayConsole($"RestCallAsync exception: {ex.Message}");
            }
            return (responseCode, responseMsg);
        }

        public static HttpMethod GetHttpMethod(string method)
        {
            try
            {
                return new HttpMethod(method);
            }
            catch (Exception ex)
            {
                DisplayConsole($"GetHttpMethod exception: {ex.Message}");
            }
            return HttpMethod.Get;
        }

        public static bool IsValidUrl(string urlString)
        {
            string pattern = @"^(http|https|ftp)\://[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(:[a-zA-Z0-9]*)?/?([a-zA-Z0-9\-\._\?\,\'/\\\+&%\$#\=~])*[^\.\,\)\(\s]$";
            Regex regex = new Regex(pattern, RegexOptions.Compiled | RegexOptions.IgnoreCase);
            return regex.IsMatch(urlString);
        }

        public static async Task<string> GetStreamAsync(string url)
        {
            try
            {
                using (HttpClient client = new HttpClient())
                {
                    using (Stream stream = await client.GetStreamAsync(url))
                    {
                        using (MemoryStream memoryStream = new MemoryStream())
                        {
                            byte[] buffer = new byte[8192];
                            int bytesRead;
                            while ((bytesRead = await stream.ReadAsync(buffer, 0, buffer.Length)) > 0)
                            {
                                await memoryStream.WriteAsync(buffer, 0, bytesRead);
                            }
                            byte[] bytes = memoryStream.ToArray();

                            // Save the byte array as an image file
                            File.WriteAllBytes("image.jpg", bytes);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                var b = ex;
            }
            return "";
        }

        public static void SaveBase64ToFile(string base64String, string filePath)
        {
            string directoryPath = Path.GetDirectoryName(filePath);
            if (!string.IsNullOrEmpty(directoryPath) && !Directory.Exists(directoryPath))
            {
                Directory.CreateDirectory(directoryPath);
            }
            // Decode the base64 string into a byte array
            byte[] fileBytes = Convert.FromBase64String(base64String);

            // Write the byte array to the specified file
            File.WriteAllBytes(filePath, fileBytes);
        }

        public static void SaveStringToFile(string str, string filePath)
        {
            string directoryPath = Path.GetDirectoryName(filePath);
            if (!string.IsNullOrEmpty(directoryPath) && !Directory.Exists(directoryPath))
            {
                Directory.CreateDirectory(directoryPath);
            }
            // Write the byte array to the specified file
            File.WriteAllText(filePath, str);
        }

        public static string GetCurrentMethodName(MethodBase mb)
        {
            string sRetval = mb.DeclaringType.Name;
            string classname = "";
            try
            {
                if (sRetval.Contains("<") && sRetval.Contains(">"))
                {
                    sRetval = Between(mb.DeclaringType.Name, "<", ">");
                    classname = mb.ReflectedType.DeclaringType.FullName ?? "";
                }
                else
                {
                    sRetval = mb.Name;
                    classname = mb.DeclaringType.FullName ?? "";
                }
                sRetval = $"{classname}.{sRetval.TrimStart('.')}";
            }
            catch (Exception ex)
            {
                DisplayConsole(ex.ToString());
            }

            return sRetval;
        }

        public static string GetCurrentClassName(MethodBase mb)
        {
            string sRetval = mb.DeclaringType.Name;
            string classname = "";
            try
            {
                if (sRetval.Contains("<") && sRetval.Contains(">"))
                {
                    sRetval = Between(mb.DeclaringType.Name, "<", ">");
                    classname = mb.ReflectedType.DeclaringType.FullName ?? "";
                }
                else
                {
                    sRetval = mb.Name;
                    classname = mb.DeclaringType.FullName ?? "";
                }
                sRetval = $"{classname}";
            }
            catch (Exception ex)
            {
                DisplayConsole(ex.ToString());
            }

            return sRetval;
        }

        public static string GetCurrentMethodNameOnly(MethodBase mb)
        {
            string text = mb.DeclaringType!.Name;
            try
            {
                if (text.Contains("<") && text.Contains(">"))
                {
                    return Between(mb.DeclaringType!.Name, "<", ">");
                }
                else
                {
                    return mb.Name;
                }
            }
            catch (Exception ex)
            {
            }

            return text;
        }

        public static string Between(string text, string from, string to)
        {
            string sretval = text;
            if (text.IndexOf(from) >= 0 && text.IndexOf(to, text.IndexOf(from)) >= 0)
            {
                sretval = text[(text.IndexOf(from) + from.Length)..text.IndexOf(to, text.IndexOf(from))];
            }
            return sretval;
        }

        public static bool IsValidJson(string json)
        {
            try
            {
                JObject.Parse(json);
                return true;
            }
            catch (Newtonsoft.Json.JsonReaderException)
            {
                //Trace.WriteLine(ex);
                return false;
            }
        }

        public static string DecodeUrlString(string base64UrlEncoded)
        {
            string base64Encoded = base64UrlEncoded.Replace('-', '+').Replace('_', '/');
            switch (base64Encoded.Length % 4)
            {
                case 2: base64Encoded += "=="; break;
                case 3: base64Encoded += "="; break;
            }
            return base64Encoded;
        }

        public static T Create_Instance<T>(string asmfile, string asmtype)
        {
            T ipl = default;
            try
            {
                var asm = Assembly.LoadFile(asmfile);
                if (asm != null)
                {
                    try
                    {
                        Type[] tps = asm.GetTypes();
                        Type tp = asm.GetType(asmtype);
                        ipl = (T)Activator.CreateInstance(tp);
                    }
                    catch (ReflectionTypeLoadException ex)
                    {
                        // now look at ex.LoaderExceptions - this is an Exception[], so:
                        foreach (Exception inner in ex.LoaderExceptions)
                        {
                            // write details of "inner", in particular inner.Message
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return ipl;
        }

        public static bool ContainsArray<T>(T[] source, T[] subArray)
        {
            HashSet<T> set1 = new HashSet<T>(source);
            HashSet<T> set2 = new HashSet<T>(subArray);
            return set2.IsSubsetOf(set1);
        }

        public static byte[] HexStrToBytes(string Hexstring)
        {
            byte[] bysRetval = null;
            try
            {
                if (!string.IsNullOrEmpty(Hexstring))
                {
                    bysRetval = Enumerable.Range(0, Hexstring.Length)
                         .Where(x => x % 2 == 0)
                         .Select(x => Convert.ToByte(Hexstring.Substring(x, 2), 16))
                         .ToArray();
                }
            }
            catch (Exception)
            {
                throw;
            }
            return bysRetval;
        }

        public static T CreateLateBindInstance<T>(string tokenPathDll, string tokenPathType)
        {
            if (!string.IsNullOrEmpty(tokenPathDll))
            {
                string asmfile = $"{tokenPathDll}";
                if (!File.Exists(asmfile))
                    asmfile = $"{AppDomain.CurrentDomain.BaseDirectory}\\{tokenPathDll}";

                if (File.Exists(asmfile))
                {
                    string absolute = Path.GetFullPath(asmfile);
                    T lib = Create_Instance<T>(absolute, tokenPathType);
                    if (lib == null)
                    {
                        DisplayConsole($"Failed to Instantiate CreateLateBindInstance: {typeof(T)}");
                    }
                    else
                    {
                        return lib;
                    }
                }
                else
                {
                    DisplayConsole($"CreateLateBindInstance Entry Assemblly file not found: {asmfile}");
                }
            }
            return default;
        }

        public static string GenerateTransID() => Guid.NewGuid().ToString().Replace("-", "") + DateTime.Now.ToEpochTime();

        public static List<string> ReplaceSolaceTopics(List<string> topics, string deviceType, string deviceID)
        {
            List<string> newTopics = new List<string>();
            foreach (string t in topics)
            {
                newTopics.Add(t.Replace("{deviceType}", deviceType).Replace("{id}", deviceID));
            }
            return newTopics;
        }

        public static List<string> ReplaceSolaceTopics(List<string> topics, Dictionary<string, string> keyValues)
        {
            List<string> newTopics = new List<string>();
            foreach (string t in topics)
            {
                string topic = t;
                topic = ReplaceSolaceTopic(topic, keyValues);
                newTopics.Add(topic);
            }
            return newTopics;
        }

        public static string ReplaceSolaceTopic(string topic, Dictionary<string, string> keyValues)
        {
            foreach (var kv in keyValues)
            {
                topic = ReplaceStringBetween(topic, kv.Key, kv.Value, "{", "}");
            }
            return topic;
        }

        public static string ReplaceStringBetween(string text, string oldStr, string newStr, string from, string to)
        {
            if (string.IsNullOrEmpty(text) || string.IsNullOrEmpty(oldStr) || string.IsNullOrEmpty(from) || string.IsNullOrEmpty(to))
                return text;

            int startIdx = 0;
            while (true)
            {
                int fromIdx = text.IndexOf(from, startIdx);
                if (fromIdx == -1)
                    break;

                int toIdx = text.IndexOf(to, fromIdx + from.Length);
                if (toIdx == -1)
                    break;

                string findStr = text.Substring(fromIdx + from.Length, toIdx - (fromIdx + from.Length));
                if (findStr.Equals(oldStr, StringComparison.OrdinalIgnoreCase))
                {
                    string toBeReplaced = $"{from}{findStr}{to}";
                    text = text.Replace(toBeReplaced, $"{newStr}");
                }

                startIdx = fromIdx + from.Length; // Move past this segment to avoid infinite loop
            }

            return text;
        }

        /// <summary>
        /// common method to get the return object send to slave from component
        /// </summary>
        /// <param name="TaskID"></param>
        /// <param name="DeviceType"></param>
        /// <param name="DeviceID"></param>
        /// <param name="TransID"></param>
        /// <returns></returns>
        public static JObject GetComponentSlaveReturnObj(string TaskID, string DeviceType, string DeviceID, string TransID = null)
        {
            JObject returnMsg = new JObject();
            returnMsg["TransID"] = TransID;
            returnMsg["TaskID"] = TaskID;
            returnMsg["DeviceType"] = DeviceType;
            returnMsg["DeviceID"] = DeviceID;
            return returnMsg;
        }

        /// <summary>
        /// common method to get the object to be sent to components
        /// </summary>
        /// <param name="TaskID"></param>
        /// <param name="TransID"></param>
        /// <param name="Meta"></param>
        /// <returns></returns>
        public static JObject GetSlaveComponentObj(string TransID, string TaskID, dynamic Meta)
        {
            JObject jObject = new JObject();
            jObject["TransID"] = TransID;
            jObject["TaskID"] = TaskID;
            jObject["Meta"] = Meta;
            return jObject;
        }


        /// <summary>
        /// common method to get the object to be sent to master
        /// </summary>
        /// <param name="TaskID"></param>
        /// <param name="TransID"></param>
        /// <param name="SlaveID"></param>
        /// <param name="Meta"></param>
        /// <returns></returns>
        public static JObject GetMasterComponentObj(string TransID, string TaskID, string SlaveID, dynamic Meta)
        {
            JObject jObject = new JObject();
            jObject["TransID"] = TransID;
            jObject["TaskID"] = TaskID;
            jObject["SlaveID"] = SlaveID;
            jObject["Meta"] = Meta;
            return jObject;
        }

        public static JToken ReplaceLongBase64Strings(JToken jsonToken)
        {
            if (!jsonToken.IsNullOrEmpty())
            {
                JTokenVisitor visitor = new JTokenVisitor();
                if (jsonToken.Type == JTokenType.Object)
                {
                    JObject jo = JObject.Parse($"{jsonToken}");
                    visitor.Visit(jo);
                    return jo;
                }
                else if (jsonToken.Type == JTokenType.Array)
                {
                    JArray ja = JArray.Parse($"{jsonToken}");
                    visitor.Visit(ja);
                    return ja;
                }
                else if (jsonToken.Type == JTokenType.String)
                {
                    string value = jsonToken.Value<string>();
                    if (visitor.IsBase64String(value) && value.Length > 300)
                    {
                        return new JValue("{this is a base64 string}");
                    }
                }
            }
            return jsonToken;
        }

        public static void EnsureDirectoryExists(string path)
        {
            if (string.IsNullOrEmpty(path))
            {
                throw new ArgumentException("Path cannot be null or empty.", nameof(path));
            }

            // Extract the directory part from the path
            string directoryPath = Path.GetDirectoryName(path);

            // Proceed only if directoryPath is not null or empty, indicating a file path was likely provided
            if (!string.IsNullOrEmpty(directoryPath))
            {
                try
                {
                    if (!Directory.Exists(directoryPath))
                    {
                        Directory.CreateDirectory(directoryPath);
                        Console.WriteLine($"Directory created: {directoryPath}");
                    }
                    else
                    {
                        Console.WriteLine($"Directory already exists: {directoryPath}");
                    }
                }
                catch (Exception e)
                {
                    throw new InvalidOperationException($"Failed to ensure the directory '{directoryPath}' exists.", e);
                }
            }
            else
            {
                throw new ArgumentException("The provided path does not include a directory.", nameof(path));
            }
        }


        public static T? ConvertJTokenToType<T>(string itm)
        {
            if (string.IsNullOrEmpty(itm)) return default;
            object obj;
            JToken jToken = JToken.Parse(itm);
            switch (jToken.Type)
            {
                case JTokenType.Object:
                case JTokenType.Array:
                    {
                        T val = jToken.ToObject<T>();
                        obj = (val != null) ? val : default(T);
                        break;
                    }
                case JTokenType.String:
                    obj = jToken.ToObject<string>() ?? null;
                    break;
                case JTokenType.Integer:
                    obj = jToken.ToObject<int>();
                    break;
                case JTokenType.Boolean:
                    obj = (jToken.ToObject<bool>() ? ((byte)1) : ((byte)0)) != 0;
                    break;
                default:
                    obj = default(T);
                    break;
            }

            return (T)obj;
        }

        public static bool IsJson(string input)
        {
            input = input.Trim();
            return (input.StartsWith("{") && input.EndsWith("}")) ||
                   (input.StartsWith("[") && input.EndsWith("]"));
        }

        public static bool IsEnumerableOrJArray<T>()
        {
            var type = typeof(T);

            if (type == typeof(string))
            {
                return false;
            }

            if (type == typeof(JArray))
            {
                return true;
            }

            return typeof(IEnumerable).IsAssignableFrom(type) ||
                   (type.IsGenericType && typeof(IEnumerable<>).IsAssignableFrom(type.GetGenericTypeDefinition()));
        }

        public static string EscapeStringForJson(string input)
        {
            return JsonConvert.SerializeObject(input);
        }

        public static string GetEnvironmentVariable(string key, Func<string> fallback)
        {
            var value = Environment.GetEnvironmentVariable(key);
            if (string.IsNullOrEmpty(value))
            {
                value = fallback();
            }
            return value;
        }

        #region image util
        //public static Bitmap ConvertBase64ToBitmap(string content)
        //{
        //    try
        //    {
        //        var bImg = Convert.FromBase64String(content);
        //        System.Drawing.Bitmap bmpVal = new System.Drawing.Bitmap(new System.IO.MemoryStream(bImg));
        //        return bmpVal;
        //    }
        //    catch (Exception ex)
        //    {
        //    }
        //    return null;
        //}

        //public static string ConvertBase64ImageToJpegBase64(string content, bool testSave = false, string saveFormat = "PNG", string fileprefix = "")
        //{
        //    string sRetval = content;
        //    try
        //    {
        //        var (base64String, mimeType) = ExtractBase64String(content);
        //        content = base64String;
        //        var bImg = Convert.FromBase64String(content);
        //        System.Drawing.Bitmap bmpVal = new System.Drawing.Bitmap(new System.IO.MemoryStream(bImg));
        //        sRetval = BitmapToBase64Sting(bmpVal, testSave);
        //        if (testSave)
        //        {
        //            string sfolder = @".\CaptureResult\";
        //            string folderPath = sfolder + fileprefix + "_" + DateTime.Now.ToString("yyyyMMddHHmmssffff");
        //            if (!System.IO.Directory.Exists(sfolder)) System.IO.Directory.CreateDirectory(sfolder);
        //            bmpVal.Save($"{folderPath}.{saveFormat}");
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        sRetval = ConvertRawToBase64String(content, testSave, saveFormat, fileprefix);
        //    }
        //    return sRetval;
        //}

        //public static string ConvertRawToBase64String(string input, bool testSave = false, string saveFormat = "PNG", string fileprefix = "")
        //{
        //    try
        //    {
        //        if (string.IsNullOrEmpty(input)) return input;
        //        var data = Convert.FromBase64String(input);
        //        IntPtr unmanagedPtr = Marshal.AllocHGlobal(data.Length);
        //        Marshal.Copy(data, 0, unmanagedPtr, data.Length);
        //        IntPtr buffer = unmanagedPtr;
        //        lock (token)
        //        {
        //            int width = 640;
        //            int height = 480;
        //            int bytes = width * height;

        //            var bmp = new System.Drawing.Bitmap(width, height, System.Drawing.Imaging.PixelFormat.Format8bppIndexed);
        //            System.Drawing.Rectangle rect = new System.Drawing.Rectangle(0, 0, bmp.Width, bmp.Height);
        //            var bmpData = bmp.LockBits(rect, System.Drawing.Imaging.ImageLockMode.ReadWrite, bmp.PixelFormat);

        //            System.Drawing.Imaging.ColorPalette tempPalette;
        //            tempPalette = bmp.Palette;

        //            for (int i = 0; i < 256; i++)
        //            {
        //                tempPalette.Entries[i] = System.Drawing.Color.FromArgb(i, i, i);
        //            }

        //            bmp.Palette = tempPalette;

        //            CopyMemory(bmpData.Scan0, buffer, (uint)bytes);
        //            bmp.UnlockBits(bmpData);

        //            System.Drawing.Bitmap resized = bmp.Clone() as System.Drawing.Bitmap;
        //            if (testSave)
        //            {
        //                string folderPath = @".\CaptureResult\" + fileprefix + "_" + DateTime.Now.ToString("yyyyMMddHHmmssffff");
        //                resized.Save($"{folderPath}.{saveFormat}");
        //            }
        //            return BitmapToBase64Sting(resized);
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        return "";
        //    }
        //}

        //public static string ConvertRawToBase64String(byte[] data)
        //{
        //    IntPtr unmanagedPtr = Marshal.AllocHGlobal(data.Length);
        //    Marshal.Copy(data, 0, unmanagedPtr, data.Length);
        //    IntPtr buffer = unmanagedPtr;
        //    lock (token)
        //    {
        //        int width = 640;
        //        int height = 480;
        //        int bytes = width * height;

        //        var bmp = new Bitmap(width, height, System.Drawing.Imaging.PixelFormat.Format8bppIndexed);
        //        System.Drawing.Rectangle rect = new System.Drawing.Rectangle(0, 0, bmp.Width, bmp.Height);
        //        var bmpData = bmp.LockBits(rect, ImageLockMode.ReadWrite, bmp.PixelFormat);

        //        ColorPalette tempPalette;
        //        tempPalette = bmp.Palette;

        //        for (int i = 0; i < 256; i++)
        //        {
        //            tempPalette.Entries[i] = System.Drawing.Color.FromArgb(i, i, i);
        //        }

        //        bmp.Palette = tempPalette;

        //        CopyMemory(bmpData.Scan0, buffer, (uint)bytes);
        //        bmp.UnlockBits(bmpData);

        //        Bitmap resized = bmp.Clone() as Bitmap;
        //        return BitmapToBase64Sting(resized);
        //    }
        //}

        //public static Bitmap WriteBitmapFile(int width, int height, byte[] imageData)
        //{
        //    using (var stream = new MemoryStream(imageData))
        //    using (var bmp = new Bitmap(width, height, PixelFormat.Format24bppRgb))
        //    {
        //        BitmapData bmpData = bmp.LockBits(new Rectangle(0, 0, bmp.Width, bmp.Height), ImageLockMode.WriteOnly, bmp.PixelFormat);

        //        IntPtr pNative = bmpData.Scan0;
        //        Marshal.Copy(imageData, 0, pNative, imageData.Length);

        //        bmp.UnlockBits(bmpData);
        //        return bmp;
        //    }
        //}

        //public static string BitmapToBase64Sting(Bitmap bmpImage, bool testSave = false)
        //{
        //    string sRetval = "";
        //    try
        //    {
        //        if (bmpImage != null)
        //        {
        //            System.Drawing.ImageConverter converter = new System.Drawing.ImageConverter();
        //            sRetval = Convert.ToBase64String((byte[])converter.ConvertTo(bmpImage, typeof(byte[]))); //Get Base64
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //    }
        //    return sRetval;
        //}

        //public static System.Drawing.Bitmap resizeImage(System.Drawing.Image imgToResize, System.Drawing.Size size)
        //{
        //    //Get the image current width  
        //    int sourceWidth = imgToResize.Width;
        //    //Get the image current height  
        //    int sourceHeight = imgToResize.Height;
        //    float nPercent = 0;
        //    float nPercentW = 0;
        //    float nPercentH = 0;
        //    //Calulate  width with new desired size  
        //    nPercentW = ((float)size.Width / (float)sourceWidth);
        //    //Calculate height with new desired size  
        //    nPercentH = ((float)size.Height / (float)sourceHeight);
        //    if (nPercentH < nPercentW)
        //        nPercent = nPercentH;
        //    else
        //        nPercent = nPercentW;
        //    //New Width  
        //    int destWidth = (int)(sourceWidth * nPercentW);
        //    //New Height  
        //    int destHeight = (int)(sourceHeight * nPercentH);
        //    System.Drawing.Bitmap b = new System.Drawing.Bitmap(destWidth, destHeight);
        //    System.Drawing.Graphics g = System.Drawing.Graphics.FromImage(b);
        //    g.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
        //    // Draw image with new width and height  
        //    g.DrawImage(imgToResize, 0, 0, destWidth, destHeight);
        //    g.Dispose();
        //    return b;
        //}

        //public static System.Drawing.Bitmap MakeGrayscale3(System.Drawing.Bitmap original)
        //{
        //    //create a blank bitmap the same size as original
        //    System.Drawing.Bitmap newBitmap = new System.Drawing.Bitmap(original.Width, original.Height);

        //    //get a graphics object from the new image
        //    using (System.Drawing.Graphics g = System.Drawing.Graphics.FromImage(newBitmap))
        //    {
        //        //create the grayscale ColorMatrix
        //        System.Drawing.Imaging.ColorMatrix colorMatrix = new System.Drawing.Imaging.ColorMatrix(
        //           new float[][]
        //           {
        //             new float[] {.3f, .3f, .3f, 0, 0},
        //             new float[] {.59f, .59f, .59f, 0, 0},
        //             new float[] {.11f, .11f, .11f, 0, 0},
        //             new float[] {0, 0, 0, 1, 0},
        //             new float[] {0, 0, 0, 0, 1}
        //           }
        //        );

        //        //create some image attributes
        //        using (System.Drawing.Imaging.ImageAttributes attributes = new System.Drawing.Imaging.ImageAttributes())
        //        {

        //            //set the color matrix attribute
        //            attributes.SetColorMatrix(colorMatrix);

        //            //draw the original image on the new image
        //            //using the grayscale color matrix
        //            g.DrawImage(original, new System.Drawing.Rectangle(0, 0, original.Width, original.Height),
        //                        0, 0, original.Width, original.Height, System.Drawing.GraphicsUnit.Pixel, attributes);
        //        }
        //    }
        //    return newBitmap;
        //}

        //public static string ConvertWsqFileToBase64(string file)
        //{
        //    Byte[] bytes = File.ReadAllBytes(file);
        //    string base64String = Convert.ToBase64String(bytes, 0, bytes.Length);
        //    return base64String;
        //}

        //public static Bitmap ConvertTextToQRCode(string Content, Color darkColor, Color lightColor, int PixelPerModule = 20, Bitmap Logo = null)
        //{
        //    Bitmap bmpRetval = null;
        //    try
        //    {
        //        //QRCoder.QRCodeGenerator qrGenerator = new QRCoder.QRCodeGenerator();
        //        //QRCoder.QRCodeData qrCodeData = qrGenerator.CreateQrCode(Content, QRCoder.QRCodeGenerator.ECCLevel.Q);
        //        //QRCoder.QRCode qrCode = new QRCoder.QRCode(qrCodeData);
        //        //bmpRetval = qrCode.GetGraphic(PixelPerModule, darkColor, lightColor, Logo);

        //        //if (bmpRetval != null)
        //        //{
        //        //    // Resize to sizeW (inches) x sizeH (inches)
        //        //    float sizeW_inc = 2, sizeH_inc = 2;
        //        //    int dpi = 96;
        //        //    float adjdpi_x = (float)bmpRetval.Width / sizeW_inc;
        //        //    float adjdpi_y = (float)bmpRetval.Height / sizeH_inc;
        //        //    bmpRetval.SetResolution(adjdpi_x, adjdpi_y);
        //        //    bmpRetval = ResizeImage(bmpRetval, dpi);
        //        //}
        //    }
        //    catch (Exception)
        //    {
        //        throw;
        //    }
        //    return bmpRetval;
        //}

        //public static Bitmap CreateQRCodeImage(dynamic p0)
        //{
        //    Bitmap bmpRetval = null;
        //    try
        //    {
        //        if (p0 != null)
        //        {
        //            string DocID = p0.DocID;
        //            int? isBlacklisted = p0.isBlacklisted;
        //            string issuingState = p0.issuingState;
        //            string printDt = p0.printDt;
        //            string GateID = p0.GateID;
        //            JObject jsnConfig = JObject.FromObject(p0.jsnConfig);
        //            string content = "{\"DocID\":\"" + DocID + "\", \"Printed DateTime\":\"" + printDt + "\", \"isBlacklisted\":\"" + isBlacklisted + "\" , \"KioskID\":\"" + GateID + "\", \"IssuingState\":\"" + issuingState + "\"}";
        //            var qrCodeSettting = jsnConfig["print_label"]?["printQR"];
        //            if (qrCodeSettting != null)
        //            {
        //                int pixelpermod = (int)(qrCodeSettting["pixelPerModule"] ?? 20);
        //                string darkColorStr = (string)(qrCodeSettting["darkColor"] ?? "#000000");
        //                Color cDark = StringToColor(darkColorStr);
        //                string lightColorStr = (string)(qrCodeSettting["lightColor"] ?? "#FFFFFF");
        //                Color cLight = StringToColor(lightColorStr);
        //                string logo = (string)(qrCodeSettting["logo"] ?? "");
        //                Bitmap bmpLg = null;
        //                if (File.Exists(logo))
        //                {
        //                    try
        //                    {
        //                        bmpLg = Image.FromFile(logo) as Bitmap;
        //                    }
        //                    catch
        //                    { }
        //                }
        //                bmpRetval = ConvertTextToQRCode(content, cDark, cLight, pixelpermod, bmpLg);
        //            }
        //        }
        //    }
        //    catch (Exception)
        //    {
        //        throw;
        //    }
        //    return bmpRetval;
        //}

        //public static Bitmap ResizeImage(Bitmap bmpImage, int newDPI)
        //{
        //    try
        //    {
        //        if (bmpImage == null) return null;
        //        Bitmap bmpResult = null;
        //        double origDPI = bmpImage.VerticalResolution;
        //        double newWidth = bmpImage.Width / origDPI * newDPI;
        //        double newHeight = bmpImage.Height / origDPI * newDPI;

        //        Bitmap bm_source = new(bmpImage);
        //        Size fitsize = FitImage(bmpImage.Size, (int)newWidth, (int)newHeight);
        //        Bitmap bm_dest = new(fitsize.Width, fitsize.Height);
        //        Graphics gr_dest = Graphics.FromImage(bm_dest);
        //        gr_dest.DrawImage(bm_source, 0, 0, bm_dest.Width + 1, bm_dest.Height + 1);

        //        Bitmap newImage = bm_dest;
        //        newImage.SetResolution(newDPI, newDPI);
        //        bmpResult = newImage;

        //        return bmpResult;
        //    }
        //    catch (Exception)
        //    {
        //        throw;
        //    }
        //}

        //public static Bitmap ResizeImage(Bitmap bmpImage, int newDPI, int width, int height)
        //{
        //    try
        //    {
        //        if (bmpImage == null) return null;
        //        Bitmap bmpResult = null;
        //        double newWidth = width;
        //        double newHeight = height;

        //        Bitmap bm_source = new(bmpImage);
        //        Size fitsize = FitImage(bmpImage.Size, (int)newWidth, (int)newHeight);
        //        Bitmap bm_dest = new(fitsize.Width, fitsize.Height);
        //        Graphics gr_dest = Graphics.FromImage(bm_dest);
        //        gr_dest.DrawImage(bm_source, 0, 0, bm_dest.Width + 1, bm_dest.Height + 1);

        //        Bitmap newImage = bm_dest;
        //        newImage.SetResolution(newDPI, newDPI);
        //        bmpResult = newImage;

        //        return bmpResult;
        //    }
        //    catch (Exception)
        //    {
        //        throw;
        //    }
        //}

        //private static Size FitImage(Size img, int _w, int _h)
        //{
        //    Size box = new(0, 0);
        //    box.Width = _w;
        //    box.Height = _h;

        //    double boxRatio = (double)box.Width / (double)box.Height;
        //    double imgRatio = (double)img.Width / (double)img.Height;
        //    double fixRatio = 0.0f;

        //    if (imgRatio > boxRatio) // Image is wider , Fix Width first case
        //    {
        //        fixRatio = (double)box.Width / (double)img.Width;
        //    }
        //    else //Image is taller or equal, Fix Height
        //    {
        //        fixRatio = (double)box.Height / (double)img.Height;
        //    }

        //    return new Size((int)(img.Width * fixRatio), (int)(img.Height * fixRatio));
        //}

        //private static Bitmap BitmapAdjustment(Bitmap originalImage, float brightness = 1.0f, float contrast = 1.0f, float gamma = 1.0f)
        //{
        //    Bitmap adjustedImage = new Bitmap(originalImage.Width, originalImage.Height);

        //    float adjustedBrightness = brightness - 1.0f;
        //    // create matrix that will brighten and contrast the image
        //    float[][] ptsArray ={
        //        new float[] {contrast, 0, 0, 0, 0}, // scale red
        //        new float[] {0, contrast, 0, 0, 0}, // scale green
        //        new float[] {0, 0, contrast, 0, 0}, // scale blue
        //        new float[] {0, 0, 0, 1.0f, 0}, // don't scale alpha
        //        new float[] {adjustedBrightness, adjustedBrightness, adjustedBrightness, 0, 1}
        //    };

        //    ImageAttributes imageAttributes = new ImageAttributes();
        //    imageAttributes.ClearColorMatrix();
        //    imageAttributes.SetColorMatrix(new ColorMatrix(ptsArray), ColorMatrixFlag.Default, ColorAdjustType.Bitmap);
        //    imageAttributes.SetGamma(gamma, ColorAdjustType.Bitmap);
        //    Graphics g = Graphics.FromImage(adjustedImage);
        //    g.DrawImage(originalImage, new Rectangle(0, 0, adjustedImage.Width, adjustedImage.Height)
        //        , 0, 0, originalImage.Width, originalImage.Height,
        //        GraphicsUnit.Pixel, imageAttributes);

        //    return adjustedImage;
        //}

        /// <summary>
        /// 
        /// </summary>
        /// <param name="dataUri"></param>
        /// <returns>base64 string, mime type</returns>
        //public static (string, string) ExtractBase64StringFromUri(string dataUri)
        //{
        //    if (string.IsNullOrEmpty(dataUri))
        //    {
        //        return (null, null);
        //    }

        //    if (dataUri.Contains(","))
        //    {
        //        string[] parts = dataUri.Split(',');

        //        if (parts.Length != 2)
        //        {
        //            return (null, null); // Invalid data URI format
        //        }

        //        string mimeTypePart = parts[0];
        //        string base64Data = parts[1];
        //        return (base64Data, mimeTypePart);
        //    }
        //    return (dataUri, null);
        //}

        ///// <summary>
        ///// this is to check the input base64 is it a valid image or raw image
        ///// </summary>
        ///// <param name="base64"></param>
        ///// <returns></returns>
        //public static string GetImageBase64(string base64)
        //{
        //    string sRetval = base64;
        //    try
        //    {
        //        var (base64String, mimeType) = ExtractBase64String(base64);
        //        base64 = base64String;
        //        var bImg = Convert.FromBase64String(base64);
        //        if (IsBytesValidImage(bImg))
        //        {
        //            return sRetval;
        //        }
        //        else
        //        {
        //            sRetval = ConvertRawToBase64String(content, testSave, saveFormat, fileprefix);
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //    }
        //    return sRetval;
        //}

        //public static bool IsBase64StringValidImage(string base64)
        //{
        //    byte[] bytes = Convert.FromBase64String(base64);
        //    return IsBytesValidImage(bytes);
        //}

        //public static bool IsBytesValidImage(byte[] bytes)
        //{
        //    // Check for JPEG header
        //    if (bytes.Length >= 2 && bytes[0] == 0xFF && bytes[1] == 0xD8)
        //    {
        //        return true;
        //    }

        //    // Check for PNG header
        //    if (bytes.Length >= 8 && bytes[0] == 0x89 && bytes[1] == 0x50 &&
        //        bytes[2] == 0x4E && bytes[3] == 0x47)
        //    {
        //        return true;
        //    }

        //    // other image formats havent check yet

        //    return false;
        //}
        #endregion image util
    }
}