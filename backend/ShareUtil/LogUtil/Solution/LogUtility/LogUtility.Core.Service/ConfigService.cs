using Newtonsoft.Json.Linq;
using LogUtility.Core.Interface;
using CommonUtil.Core.Service;

namespace LogUtility.Core.Service
{
    internal class ConfigService
    {
        private JObject? _jsonRoot;
        public ConfigService()
        {
            using (StreamReader file = File.OpenText("LogUtil.json"))
            {
                _jsonRoot = JObject.Parse(file.ReadToEnd());
            }
        }
        public JToken GetLoggingServiceConfig()
        {
            return _jsonRoot["loggingService"];
        }
    }
}
