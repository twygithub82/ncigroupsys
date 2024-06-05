using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ImageUtility.Core.Service
{
    public static class Extensions
    {
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
