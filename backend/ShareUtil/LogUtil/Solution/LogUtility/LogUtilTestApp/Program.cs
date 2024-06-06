// See https://aka.ms/new-console-template for more information
using System;
using LogUtility.Core.Interface;
using LogUtility.Core.Service;
using Serilog;
namespace LogUtility
{
    class Program
    {
        private ILogger? _seriLog;
        static void Main(string[] args)
        {
            Console.WriteLine("Hello, .NET 6!");
            ILoggingUtil _loggingService = new LoggingUtil("Debug", "C:\\LogUtil\\Logs2\\Default_Logzz_.txt");
            _loggingService.Log("DKK Serilog ...Starting Now", LogLevel.Debug, LogDestination.Both);
            /*_loggingService.Log("DKK Serilog ...Starting", LogLevel.Debug, LogDestination.Console);
            _loggingService.Log("DKK Serilog ...Starting", LogLevel.Debug, LogDestination.Console);
            _loggingService.Log("DKK Serilog ...Starting", LogLevel.Debug, LogDestination.Console);*/
            //_loggingService.Logger.Information( $" Starting....");
        }
    }
}