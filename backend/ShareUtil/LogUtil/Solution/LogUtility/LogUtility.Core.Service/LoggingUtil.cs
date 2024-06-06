using Newtonsoft.Json.Linq;
using Serilog.Core;
using Serilog;
using LogUtility.Core.Interface;
using Serilog.Events;
using System.Reflection;
using System.Runtime.CompilerServices;
using System.Diagnostics;
using CommonUtil.Core.Service;

namespace LogUtility.Core.Service
{
    public class LoggingUtil : ILoggingUtil
    {
        private Logger? _consoleLogger;
        private Logger? _fileLogger;
        private LogEventLevel _logEventLevel;
        private string _logPath;
        private string _logTemplate;

        public LoggingUtil()
        {
            InitializeLogger();
        }

        public LoggingUtil(string logEventLevel = null, string logPath = null, string logTemplate = null)
        {
            _logEventLevel = !string.IsNullOrEmpty(logEventLevel) ? logEventLevel.GetEnum<LogEventLevel>() : LogEventLevel.Information;
            _logPath = logPath ?? "C:\\LogUtil\\Logs\\Default_Log_.txt";
            _logTemplate = logTemplate ?? "{Timestamp:yyyy-MM-dd HH:mm:ss:fff} [{Level}] Message: {Message}{NewLine}{Properties}{NewLine}{Exception}";

            InitializeLogger();
        }

        private void InitializeLogger()
        {
            try
            {
                Util.EnsureDirectoryExists(_logPath);

                var levelSwitch = new LoggingLevelSwitch(initialMinimumLevel: _logEventLevel);

                _consoleLogger ??= new LoggerConfiguration()
                    .MinimumLevel.ControlledBy(levelSwitch)
                    .WriteTo.Console(outputTemplate: _logTemplate, restrictedToMinimumLevel: levelSwitch.MinimumLevel)
                    .CreateLogger();

                _fileLogger ??= new LoggerConfiguration()
                    .MinimumLevel.ControlledBy(levelSwitch)
                    .WriteTo.File(_logPath, restrictedToMinimumLevel: levelSwitch.MinimumLevel,
                        shared: true, rollingInterval: RollingInterval.Day, fileSizeLimitBytes: 536870912,
                        rollOnFileSizeLimit: true, retainedFileCountLimit: 14, outputTemplate: _logTemplate)
                    .CreateLogger();

                Util.DisplayConsole("Logger initialized successfully.");
            }
            catch (Exception ex)
            {
                Util.DisplayConsole($"Exception: {ex} \n => Failed to initialize logger");
            }
        }

        public void LogToConsole(string message, LogLevel logLevel = LogLevel.Information)
        {
            if (_consoleLogger == null)
            {
                Util.DisplayConsole("Console logger is not initialized");
                return;
            }

            // Log the message based on the specified log level to the console
            switch (logLevel)
            {
                case LogLevel.Verbose:
                    _consoleLogger.Verbose(message);
                    break;
                case LogLevel.Debug:
                    _consoleLogger.Debug(message);
                    break;
                case LogLevel.Information:
                    _consoleLogger.Information(message);
                    break;
                case LogLevel.Warning:
                    _consoleLogger.Warning(message);
                    break;
                case LogLevel.Error:
                    _consoleLogger.Error(message);
                    break;
                case LogLevel.Fatal:
                    _consoleLogger.Fatal(message);
                    break;
            }
        }

        public void LogToFile(string message, LogLevel logLevel = LogLevel.Information)
        {
            if (_fileLogger == null)
            {
                Util.DisplayConsole("File logger is not initialized");
                return;
            }

            // Log the message based on the specified log level to a file
            switch (logLevel)
            {
                case LogLevel.Verbose:
                    _fileLogger.Verbose(message);
                    break;
                case LogLevel.Debug:
                    _fileLogger.Debug(message);
                    break;
                case LogLevel.Information:
                    _fileLogger.Information(message);
                    break;
                case LogLevel.Warning:
                    _fileLogger.Warning(message);
                    break;
                case LogLevel.Error:
                    _fileLogger.Error(message);
                    break;
                case LogLevel.Fatal:
                    _fileLogger.Fatal(message);
                    break;
            }
        }
        public void Log(string message, LogLevel logLevel = LogLevel.Information, LogDestination logDestination = LogDestination.Both)
        {
            if (_fileLogger == null || _consoleLogger == null)
            {
                Util.DisplayConsole("Logger is not initialized");
                return;
            }

            switch (logDestination)
            {
                case LogDestination.Console:
                    LogToConsole(message, logLevel);
                    break;
                case LogDestination.File:
                    LogToFile(message, logLevel);
                    break;
                case LogDestination.Both:
                    LogToConsole(message, logLevel);
                    LogToFile(message, logLevel);
                    break;
            }
        }
    }
}



/*using Newtonsoft.Json.Linq;
using Serilog.Core;
using Serilog;
using LogUtility.Core.Interface;
namespace LogUtility.Core.Service
{
    public class LoggingUtil : ILoggingUtil
    {
        public Logger? _logger;
        public LoggingUtil()
        {
            ConfigService _configService = new ConfigService();
            // load serilog.json to IConfiguration
            int switchlevel = 1;
            try
            {
                JObject loggingServiceRoot = (JObject)_configService.GetLoggingServiceConfig();
                switch (loggingServiceRoot["LevelSwitch"]?.First?.First?.ToString())
                {
                    case "Verbose":
                        switchlevel = 0;
                        break;
                    case "Debug":
                        switchlevel = 1;
                        break;
                    case "Information":
                        switchlevel = 2;
                        break;
                    case "Warning":
                        switchlevel = 3;
                        break;
                    case "Error":
                        switchlevel = 4;
                        break;
                    case "Fatal":
                        switchlevel = 5;
                        break;
                    default:
                        switchlevel = 6;
                        break;
                }
                var levelSwitch = new LoggingLevelSwitch(initialMinimumLevel: (Serilog.Events.LogEventLevel)switchlevel);
                string template = "{Timestamp:yyyy-MM-dd HH:mm:ss:fff} [{Level}] Message: {Message}{NewLine}{Properties}{NewLine}{Exception}";
                _logger = new LoggerConfiguration()
                    .Enrich.FromLogContext()
                    .MinimumLevel.ControlledBy(levelSwitch)
                    .WriteTo.Debug(outputTemplate: template)
                    .WriteTo.Console(Serilog.Events.LogEventLevel.Debug)
                    .WriteTo.File(loggingServiceRoot["path"].ToString(), restrictedToMinimumLevel: levelSwitch.MinimumLevel,
                    shared: true, rollingInterval: RollingInterval.Day, fileSizeLimitBytes: 536870912,
                    rollOnFileSizeLimit: true, retainedFileCountLimit: 14, outputTemplate: template)
                    .CreateLogger();
            }
            catch (Exception ex)
            {
                Console.Write($"Execption: {ex} \n => Fail to retrieve LevelSwitch inside LogUtil.Json");
            }
        }
        public ILogger? Logger => _logger;
    }
}*/