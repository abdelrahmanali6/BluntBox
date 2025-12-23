using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using BluntBox.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BluntBox.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MessagesController : ControllerBase
    {
        private readonly IMessageService _messages;

        public MessagesController(IMessageService messages)
        {
            _messages = messages;
        }

        [Authorize]
        [HttpGet("received")]
        public async Task<IActionResult> GetReceived()
        {
            // Try to read user id from JWT 'sub' claim
            var sub = User.FindFirst("sub")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(sub, out var userId)) return Unauthorized();

            var list = await _messages.GetReceivedMessagesAsync(userId);
            return Ok(list);
        }

        [HttpGet("{messageId}")]
        public async Task<IActionResult> GetMessage(Guid messageId)
        {
            if (messageId == Guid.Empty) return BadRequest();

            var result = await _messages.GetMessageWithRepliesAsync(messageId);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpGet("public/{recipientUserId}")]
        public async Task<IActionResult> GetPublic(Guid recipientUserId)
        {
            if (recipientUserId == Guid.Empty) return BadRequest();

            var list = await _messages.GetPublicMessagesAsync(recipientUserId);
            return Ok(list);
        }
    }
}
