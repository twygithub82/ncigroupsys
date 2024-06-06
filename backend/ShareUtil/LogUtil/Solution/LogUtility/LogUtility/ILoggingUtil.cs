using LogUtility.Core.Interface;
using Newtonsoft.Json.Linq;
using Serilog;
using System.Threading.Tasks;
namespace LogUtility.Core.Interface
{
    /// <summary>
    /// Usage:  var loggingUtil = new LoggingUtil();
    ///loggingUtil.Log("This is an error message", LogLevel.Error, LogDestination.File);
    ///loggingUtil.Log("This is an information message", LogLevel.Information, LogDestination.Console);
    ///loggingUtil.Log("This is a debug message", LogLevel.Debug, LogDestination.Both);
    /// </summary>
    public interface ILoggingUtil
    {
       void Log(string message, LogLevel logLevel = LogLevel.Information, LogDestination logDestination = LogDestination.Both);
    }

    public enum LogLevel
    {
        Verbose,
        Debug,
        Information,
        Warning,
        Error,
        Fatal
    }

    public enum LogDestination
    {
        Console,
        File,
        Both
    }
}
