Step 1 Declaration:    private readonly ILogger _log; private readonly ILoggingService _loggingService;
Step 2 Initialize:  _loggingService = new LoggingService();
Step 3 Usage: 
_loggingService.Logger.ForContext("Source", typeof(DeviceInfoService).FullName);
		
_log.Information(_logStart + $" This is Log Util");