using System;
using System.Threading.Tasks;
using BluntBox.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BluntBox.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PublicMessageController : ControllerBase
    {
        private readonly IMessageService _messages;

        public PublicMessageController(IMessageService messages)
        {
            _messages = messages;
        }

        [HttpGet("{recipientUserId}")]
        public async Task<IActionResult> GetPublicMessages(Guid recipientUserId)
        {
            var list = await _messages.GetPublicMessagesAsync(recipientUserId);
            return Ok(list);
        }
    }
}
