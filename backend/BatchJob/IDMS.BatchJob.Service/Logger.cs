using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Org.BouncyCastle.Bcpg.OpenPgp;
using Serilog;

namespace IDMS.BatchJob.Service
{
    public static class Logger
    {
        // Initialize the logger
        static string tempString = "{Timestamp:yyyy-MM-dd HH:mm:ss} {Message}{NewLine}{Exception}";

        static Logger()
        {
            Log.Logger = new LoggerConfiguration()
                .MinimumLevel.Debug()
                .WriteTo.Console(outputTemplate: tempString) // Log to console
                .WriteTo.File("logs/crosscheck.txt",
                    rollingInterval: RollingInterval.Day,
                    outputTemplate: tempString) // Log to file
                .CreateLogger();
        }

        // Expose a property to get the logger
        public static ILogger Instance => Log.Logger;

        // Optionally, you can add a method to flush logs
        public static void CloseAndFlush()
        {
            Log.CloseAndFlush();
        }
    }
}
