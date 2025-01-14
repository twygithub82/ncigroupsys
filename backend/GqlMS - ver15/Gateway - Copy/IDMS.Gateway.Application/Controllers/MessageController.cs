using HotChocolate.Subscriptions;
using Microsoft.AspNetCore.Mvc;

namespace gateway_graphql_ms.Controllers
{
    public class MessagesController:ControllerBase
    {
        private readonly ITopicEventSender _eventSender;

        public MessagesController(ITopicEventSender eventSender)
        {
            _eventSender = eventSender;
        }

        [HttpPost]
        public async Task<IActionResult> PostMessage([FromBody] string message)
        {
            await _eventSender.SendAsync("MessageReceived", message);
            return Ok();
        }
    }
}
