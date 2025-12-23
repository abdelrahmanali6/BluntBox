using System;
using System.Threading.Tasks;
using BluntBox.Application.Interfaces;
using BluntBox.Application.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BluntBox.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MessageController : ControllerBase
    {
        private readonly IMessageService _messages;

        public MessageController(IMessageService messages)
        {
            _messages = messages;
        }

        [HttpPost]
        public async Task<IActionResult> Send([FromBody] MessageCreateDto dto)
        {
            var result = await _messages.SendMessageAsync(dto);
            return Ok(result);
        }

        [Authorize]
        [HttpPost("reply/{messageId}")]
        public async Task<IActionResult> Reply(Guid messageId, [FromBody] BluntBox.Application.Models.ReplyCreateDto replyDto)
        {
            if (messageId == Guid.Empty) return BadRequest();

            var sub = User.FindFirst("sub")?.Value ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(sub, out var replierUserId)) return Unauthorized();

            var result = await _messages.AddReplyAsync(messageId, replyDto, replierUserId);
            if (result == null) return NotFound();
            return Ok(result);
        }
    }
}
