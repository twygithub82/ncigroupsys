namespace SolaceUtil.Core.Interface
{
    public interface ISolaceUtility
    {
        void ConnectForPersistentMessaging(string queueName, Action<string, string> messageReceivedCallback, List<string> topics = null);
        void ConnectForDirectMessaging(Action<string, string> messageReceivedCallback, List<string> topics = null);
        /// <summary>
        /// based on type to determine to connect for persistent or direct messaging
        /// </summary>
        /// <param name="type">persistent or direct</param>
        /// <param name="queueName"></param>
        /// <param name="messageReceivedCallback"></param>
        /// <param name="topics"></param>
        void ConnectForMessaging(string type, string queueName, Action<string, string> messageReceivedCallback, List<string> topics = null);
        void SendTopic(string topic, string messageText, string host, string vpnName, string username, string password);
        void SendQueue(string queueName, string messageText, string host, string vpnName, string username, string password);
        void Dispose();
    }
}