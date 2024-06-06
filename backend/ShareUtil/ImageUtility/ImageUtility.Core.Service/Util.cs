using System;
using System.Drawing;
using System.Reflection;
using System.Runtime.InteropServices;
using Newtonsoft.Json.Linq;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;

namespace ImageUtility.Core.Service
{
    public static class ImageUtil
    {
        public static string ConvertRawToValidBase64_(string rawBase64)
        {
            if (string.IsNullOrEmpty(rawBase64))
                throw new ArgumentNullException(nameof(rawBase64));

            try
            {
                // Convert the raw Base64 to an image to validate
                byte[] imageBytes = Convert.FromBase64String(rawBase64);
                using (MemoryStream ms = new MemoryStream(imageBytes))
                {
                    using (Image image = Image.Load(ms))
                    {
                        // Convert the image back to Base64 to ensure validity
                        using (MemoryStream msOutput = new MemoryStream())
                        {
                            image.SaveAsPng(msOutput);
                            return Convert.ToBase64String(msOutput.ToArray());
                        }
                    }
                }
            }
            catch
            {
                throw new InvalidOperationException("Invalid image data. Cannot convert to a valid image.");
            }
        }

        public static string ConvertRawToValidBase64(string rawBase64)
        {
            try
            {
                if (string.IsNullOrEmpty(rawBase64))
                    throw new ArgumentNullException(nameof(rawBase64));
                var data = Convert.FromBase64String(rawBase64);
                int width = 640;
                int height = 480;

                // ImageSharp does not have a direct method to create an image from a raw byte array as System.Drawing does.
                // You'll need to create an Image<Rgba32> (or another pixel format) and work with it.
                // Assuming the raw data is in a format that can be directly mapped to pixels,
                // the following approach uses Rgba32 format as an example.
                using (var image = new Image<L8>(Configuration.Default, width, height))
                {
                    // Populate the image with pixel data
                    for (int y = 0; y < height; y++)
                    {
                        for (int x = 0; x < width; x++)
                        {
                            // Calculate the index for the one-dimensional data array
                            int index = y * width + x;
                            byte pixelValue = data[index];

                            // Set the pixel value at (x, y)
                            image[x, y] = new L8(pixelValue);
                        }
                    }

                    using (var ms = new MemoryStream())
                    {
                        // Save the image to a stream in the desired format and then convert it to Base64
                        image.SaveAsPng(ms);
                        return Convert.ToBase64String(ms.ToArray());
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error converting image: {ex.Message}");
                return "";
            }
        }

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
        //        if (string.IsNullOrEmpty(base64)) return base64;
        //        var data = Convert.FromBase64String(base64);
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
        //            if (saveFile)
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

        public static string ConvertWsqFileToBase64(string file)
        {
            Byte[] bytes = File.ReadAllBytes(file);
            string base64String = Convert.ToBase64String(bytes, 0, bytes.Length);
            return base64String;
        }

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

        //public static Bitmap ResizeImage(Bitmap bitmap, int newDPI, int width, int height)
        //{
        //    try
        //    {
        //        if (bitmap == null) return null;
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

        public static string ResizeImage(string base64Str, int newDPI, int width, int height)
        {
            try
            {
                if (string.IsNullOrEmpty(base64Str)) return null;
                // Convert Base64 string to a byte array
                byte[] imageData = Convert.FromBase64String(base64Str);

                // Use a MemoryStream as the source for Image.Load
                using (var ms = new MemoryStream(imageData))
                {
                    // Load the image from the MemoryStream
                    using (Image image = Image.Load(ms)) // Automatically detects format
                    {
                        // Change DPI (note: this might not affect the image as expected, as DPI is a metadata property)
                        image.Metadata.HorizontalResolution = newDPI;
                        image.Metadata.VerticalResolution = newDPI;

                        // Resize the image
                        image.Mutate(x => x.Resize(width, height));

                        // Save the image to a new MemoryStream and then to a byte array
                        // If saving in a specific format regardless of the original, specify the encoder explicitly
                        using (var outputMemoryStream = new MemoryStream())
                        {
                            // Example: Saving as JPEG. Replace with the format of your choice or parameterize as needed
                            image.SaveAsJpeg(outputMemoryStream);
                            byte[] resizedImageBytes = outputMemoryStream.ToArray();

                            // Convert the byte array back to a Base64 string
                            return Convert.ToBase64String(resizedImageBytes);
                        }
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

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

        public static (string, string) ExtractBase64StringFromUri(string dataUri)
        {
            if (string.IsNullOrEmpty(dataUri))
            {
                return (null, null);
            }

            if (dataUri.Contains(","))
            {
                string[] parts = dataUri.Split(',');

                if (parts.Length != 2)
                {
                    return (null, null); // Invalid data URI format
                }

                string mimeTypePart = parts[0];
                string base64Data = parts[1];
                return (base64Data, mimeTypePart);
            }
            return (dataUri, null);
        }

        /// <summary>
        /// this is to check the input base64 is it a valid image or raw image
        /// </summary>
        /// <param name="base64"></param>
        /// <returns></returns>
        public static string GetImageBase64(string base64)
        {
            string sRetval = base64;
            try
            {
                var (base64String, mimeType) = ExtractBase64StringFromUri(base64);
                sRetval = base64String;
                if (string.IsNullOrEmpty(sRetval)) return sRetval;
                var bImg = Convert.FromBase64String(sRetval);
                if (IsBytesValidImage(bImg))
                {
                    return sRetval;
                }
                else
                {
                    sRetval = ConvertRawToValidBase64(sRetval);
                }
            }
            catch (Exception ex)
            {
            }
            return sRetval;
        }

        public static bool IsBase64StringValidImage(string base64)
        {
            byte[] bytes = Convert.FromBase64String(base64);
            return IsBytesValidImage(bytes);
        }

        public static bool IsBytesValidImage(byte[] bytes)
        {
            // Check for JPEG header
            if (bytes.Length >= 2 && bytes[0] == 0xFF && bytes[1] == 0xD8)
            {
                return true;
            }

            // Check for PNG header
            if (bytes.Length >= 8 && bytes[0] == 0x89 && bytes[1] == 0x50 &&
                bytes[2] == 0x4E && bytes[3] == 0x47)
            {
                return true;
            }

            // other image formats havent check yet

            return false;
        }

        public static void SaveBase64ToImage(string base64, string path)
        {
            try
            {
                string directoryPath = Path.GetDirectoryName(path);
                if (!string.IsNullOrEmpty(directoryPath) && !Directory.Exists(directoryPath))
                {
                    Directory.CreateDirectory(directoryPath);
                }
                Image img = ConvertBase64ToImage(base64);
                img.Save(path);
            }
            catch (Exception)
            {
                throw;
            }
        }

        public static string CreateBase64FromPointer(IntPtr imageData, int width, int height, string pixelFormat)
        {
            // Determine pixel format from string input
            var pixelType = Type.GetType($"SixLabors.ImageSharp.PixelFormats.{pixelFormat}", true);

            // Create a method to load the pixel data based on pixel type
            MethodInfo loadPixelDataMethod = typeof(Image).GetMethod("LoadPixelData").MakeGenericMethod(new Type[] { pixelType });

            // Allocate byte array to copy the data
            int bytesPerPixel = (int)pixelType.GetProperty("BytesPerPixel").GetValue(null);
            var buffer = new byte[width * height * bytesPerPixel];

            // Copy data from unmanaged memory to the buffer
            Marshal.Copy(imageData, buffer, 0, buffer.Length);

            // Load the image from the buffer
            using (Image image = (Image)loadPixelDataMethod.Invoke(null, new object[] { buffer, width, height }))
            {
                using (var ms = new MemoryStream())
                {
                    // Save the image to the stream as PNG (or any other format)
                    image.SaveAsPng(ms);
                    // Convert the stream to a base64 string
                    return Convert.ToBase64String(ms.ToArray());
                }
            }
        }

        #region private method
        private static Image ConvertBase64ToImage(string base64String)
        {
            if (string.IsNullOrEmpty(base64String))
                throw new ArgumentNullException(nameof(base64String));

            try
            {
                byte[] imageBytes = Convert.FromBase64String(base64String);
                using (MemoryStream ms = new MemoryStream(imageBytes))
                {
                    return Image.Load(ms);
                }
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException("Could not convert Base64 string to image.", ex);
            }
        }
        #endregion private method
    }
}