using SolaceUtil.Core.Interface;
using SolaceSystems.Solclient.Messaging;
using System.Text;
using CommonUtil.Core.Service;
using SolaceUtil.Core.Service.Classes;

namespace SolaceUtil.Core.Service
{
    public class SolaceUtility : ISolaceUtility, IDisposable
    {
        public bool logDebugging = true;
        private string queueName = "";
        private ISession? session;
        private IContext? context;
        private IFlow? flow;
        private Action<string, string> _messageReceivedCallback;

        public SolaceUtility()
        {
            try
            {
                InitializeSolaceContext();
            }
            catch
            {
                throw;
            }
        }

        public SolaceUtility(string host, string vpnName, string username, string password)
        {
            try
            {
                InitializeSolaceContext();
                context = ContextFactory.Instance.CreateContext(new ContextProperties(), null);

                SessionProperties sessionProps = new SessionProperties()
                {
                    Host = host,
                    VPNName = vpnName,
                    UserName = username,
                    Password = password,
                    ReconnectRetries = -1
                };
                session = context.CreateSession(sessionProps, HandleMessage, HandleSession);
            }
            catch
            {
                throw;
            }
        }

        private void InitializeSolaceContext()
        {
            ContextFactoryProperties props = new ContextFactoryProperties
            {
                SolClientLogLevel = SolLogLevel.Debug
            };
            ContextFactory.Instance.Init(props);
        }

        /// <summary>
        /// For persistence message
        /// </summary>
        /// <param name="topics">Topics be created for the queue</param>
        /// <param name="queueName">Queue name to be created</param>
        /// <param name="messageReceivedCallback">Message callback handler</param>
        public void ConnectForPersistentMessaging(string queueName, Action<string, string> messageReceivedCallback, List<string> topics = null)
        {
            try
            {
                if (session == null)
                {
                    Util.DisplayConsole("ConnectAndSubscribe: Session is null.");
                    return;
                }
                ReturnCode returnCode = session.Connect();
                if (returnCode != ReturnCode.SOLCLIENT_OK)
                {
                    Util.DisplayConsole("Failed to connect. Return Code: " + returnCode);
                    return;
                }

                IEndpoint queueEndpoint = CreateQueue(queueName);
                this.queueName = queueEndpoint?.Name;
                flow = session.CreateFlow(
                    new FlowProperties
                    {
                        AckMode = MessageAckMode.ClientAck
                    },
                    queueEndpoint,
                    null,
                    (source, args) =>
                    {
                        // Received a message
                        using (IMessage message = args.Message)
                        {
                            // Expecting the message content as a binary attachment
                            IDestination receivedTopic = message.Destination;
                            var data = (message.BinaryAttachment ?? message.XmlContent);
                            if (data != null)
                            {
                                messageReceivedCallback(receivedTopic.Name, Encoding.ASCII.GetString(data));
                            }
                            flow?.Ack(message.ADMessageId);
                        }
                    },
                    (source, args) =>
                    {
                        Util.DisplayConsole("Flow event message.");
                        // Received a message
                    }
                );

                if (topics != null)
                {
                    foreach (string topic in topics)
                    {
                        ITopic solaceTopic = ContextFactory.Instance.CreateTopic(topic);
                        session.Subscribe(queueEndpoint, solaceTopic, SubscribeFlag.WaitForConfirm, null);
                    }
                }
                flow.Start();
                Util.DisplayConsole("Connected and subscribed. Waiting for messages...");
            }
            catch (OperationErrorException ex)
            {
                var exception = new SolaceUtilException($"{ex}", ex);
                exception.returnCode = ex.ReturnCode.ToString().GetEnum<SolaceReturnCode>();
                throw exception;
            }
            catch
            {
                throw;
            }
        }

        /// <summary>
        /// For direct message
        /// </summary>
        /// <param name="messageReceivedCallback"></param>
        /// <param name="topics"></param>
        public void ConnectForDirectMessaging(Action<string, string> messageReceivedCallback, List<string> topics)
        {
            try
            {
                if (session == null)
                {
                    Util.DisplayConsole("ConnectAndSubscribe: Session is null.");
                    return;
                }
                ReturnCode returnCode = session.Connect();
                if (returnCode != ReturnCode.SOLCLIENT_OK)
                {
                    Util.DisplayConsole("Failed to connect. Return Code: " + returnCode);
                    return;
                }

                _messageReceivedCallback = messageReceivedCallback;

                if (topics != null)
                {
                    foreach (string topic in topics)
                    {
                        ITopic solaceTopic = ContextFactory.Instance.CreateTopic(topic);
                        //session.Subscribe(queueEndpoint, solaceTopic, SubscribeFlag.WaitForConfirm, null);
                        session.Subscribe(solaceTopic, false);
                    }
                }
                Util.DisplayConsole("Connected and subscribed. Waiting for messages...");
            }
            catch (OperationErrorException ex)
            {
                var exception = new SolaceUtilException($"{ex}", ex);
                exception.returnCode = ex.ReturnCode.ToString().GetEnum<SolaceReturnCode>();
                throw exception;
            }
            catch
            {
                throw;
            }
        }

        public void ConnectForMessaging(string type, string queueName, Action<string, string> messageReceivedCallback, List<string> topics = null)
        {
            try
            {
                switch (type?.ToLower() ?? "")
                {
                    case "persistent":
                        if (!string.IsNullOrEmpty(queueName))
                        {
                            ConnectForPersistentMessaging(queueName, messageReceivedCallback, topics);
                        }
                        else
                        {
                            throw new Exception("Missing queueName.");
                        }
                        break;
                    case "direct":
                        if (topics != null && topics.Count > 0)
                        {
                            ConnectForDirectMessaging(messageReceivedCallback, topics);
                        }
                        else
                        {
                            throw new Exception("Missing topics.");
                        }
                        break;
                    default:
                        throw new Exception("Missing type.");
                }
            }
            catch
            {
                throw;
            }
        }

        public void Dispose()
        {
            try
            {
                Disconnect();
            }
            catch
            {
                throw;
            }
        }

        public void SendTopic(string topic, string messageText, string host, string vpnName, string username, string password)
        {
            try
            {
                using (IContext context = ContextFactory.Instance.CreateContext(new ContextProperties(), null))
                {
                    using (ISession session = context.CreateSession(new SessionProperties
                    {
                        Host = host,
                        VPNName = vpnName,
                        UserName = username,
                        Password = password
                    }, HandleMessage, null))
                    {
                        ReturnCode returnCode = session.Connect();
                        if (returnCode != ReturnCode.SOLCLIENT_OK)
                        {
                            Util.DisplayConsole($"SendTopic connection failed. Return code: {returnCode}");
                            return;
                        }

                        ITopic solaceTopic = ContextFactory.Instance.CreateTopic(topic);
                        IMessage message = ContextFactory.Instance.CreateMessage();
                        message.Destination = solaceTopic;
                        message.BinaryAttachment = Encoding.UTF8.GetBytes(messageText);

                        returnCode = session.Send(message);
                        session.Disconnect();
                        if (returnCode != ReturnCode.SOLCLIENT_OK)
                        {
                            Util.DisplayConsole($"SendTopic send failed. Return code: {returnCode}");
                            return;
                        }
                    }
                }
            }
            catch
            {
                throw;
            }
        }

        public void SendQueue(string queueName, string messageText, string host, string vpnName, string username, string password)
        {
            try
            {
                using (IContext context = ContextFactory.Instance.CreateContext(new ContextProperties(), null))
                {
                    using (ISession session = context.CreateSession(new SessionProperties
                    {
                        Host = host,
                        VPNName = vpnName,
                        UserName = username,
                        Password = password
                    }, HandleMessage, null))
                    {
                        ReturnCode returnCode = session.Connect();
                        if (returnCode != ReturnCode.SOLCLIENT_OK)
                        {
                            Util.DisplayConsole($"SendQueue connection failed. Return code: {returnCode}");
                            return;
                        }

                        IQueue solaceQueue = ContextFactory.Instance.CreateQueue(queueName);
                        IMessage message = ContextFactory.Instance.CreateMessage();
                        message.Destination = solaceQueue;
                        message.BinaryAttachment = Encoding.UTF8.GetBytes(messageText);

                        returnCode = session.Send(message);
                        session.Disconnect();
                        if (returnCode != ReturnCode.SOLCLIENT_OK)
                        {
                            Util.DisplayConsole($"SendQueue send failed. Return code: {returnCode}");
                            return;
                        }
                    }
                }
            }
            catch
            {
                throw;
            }
        }

        private IEndpoint? CreateQueue(string queueName)
        {
            try
            {
                if (session == null)
                {
                    Util.DisplayConsole("CreateQueue: Session is null.");
                    return null;
                }
                IQueue queue = ContextFactory.Instance.CreateQueue(queueName);

                EndpointProperties endpointProps = new EndpointProperties()
                {
                    Permission = EndpointProperties.EndpointPermission.Consume,
                    AccessType = EndpointProperties.EndpointAccessType.Exclusive,
                    RespectsMsgTTL = true
                };

                ReturnCode returnCode = session.Provision(queue, endpointProps, ProvisionFlag.IgnoreErrorIfEndpointAlreadyExists | ProvisionFlag.WaitForConfirm, null);
                Util.DisplayConsole($"Queue creation status: {returnCode}.");
                return queue;
            }
            catch (Exception ex)
            {
                Util.DisplayConsole($"CreateQueue exception: {ex}");
            }
            return null;
        }

        private void DeleteQueue(string queueName)
        {
            try
            {
                if (session == null)
                {
                    Util.DisplayConsole("DeleteQueue: Session is null, cannot delete.");
                    return;
                }

                IQueue queue = ContextFactory.Instance.CreateQueue(queueName);

                ReturnCode returnCode = session.Deprovision(queue, ProvisionFlag.WaitForConfirm, null);
                Util.DisplayConsole($"Queue delete status: {returnCode}");
            }
            catch (Exception ex)
            {
                Util.DisplayConsole($"DeleteQueue exception: {ex}");
            }
        }

        private void Disconnect()
        {
            try
            {
                if (!string.IsNullOrEmpty(queueName))
                {
                    DeleteQueue(queueName);
                }

                if (flow != null)
                {
                    flow.Dispose();
                    flow = null;
                }

                if (session != null)
                {
                    session.Disconnect();
                    session.Dispose();
                    session = null;
                }
            }
            catch
            {
                throw;
            }
        }

        private void HandleMessage(object source, MessageEventArgs args)
        {
            try
            {
                // Received a message
                using (IMessage message = args.Message)
                {
                    // Expecting the message content as a binary attachment
                    if (_messageReceivedCallback != null)
                    {
                        IDestination receivedTopic = message.Destination;
                        var data = (message.BinaryAttachment ?? message.XmlContent);
                        if (data != null)
                        {
                            _messageReceivedCallback(receivedTopic.Name, Encoding.ASCII.GetString(data));
                        }
                    }
                }
            }
            catch
            {
                throw;
            }
        }

        private void HandleSession(object source, SessionEventArgs args)
        {
            try
            {
                Util.DisplayConsole($"Solace session event: {args} =====");
            }
            catch
            {
                throw;
            }
        }
    }
}