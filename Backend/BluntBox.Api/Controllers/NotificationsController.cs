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
    [Authorize]
    public class NotificationsController : ControllerBase
    {
        private readonly INotificationService _notifications;

        public NotificationsController(INotificationService notifications)
        {
            _notifications = notifications;
        }

        private Guid GetUserIdFromClaims()
        {
            var sub = User.FindFirst("sub")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return Guid.TryParse(sub, out var id) ? id : Guid.Empty;
        }

        [HttpGet("unread-count")]
        public async Task<IActionResult> GetUnreadCount()
        {
            var userId = GetUserIdFromClaims();
            if (userId == Guid.Empty) return Unauthorized();

            var count = await _notifications.GetUnreadCountAsync(userId);
            return Ok(new { count });
        }

        [HttpGet]
        public async Task<IActionResult> GetList([FromQuery] int skip = 0, [FromQuery] int take = 50)
        {
            var userId = GetUserIdFromClaims();
            if (userId == Guid.Empty) return Unauthorized();

            var list = await _notifications.GetListAsync(userId, skip, take);
            return Ok(list.Select(n => new {
                id = n.Id,
                type = n.Type,
                referenceId = n.ReferenceId,
                title = n.Title,
                body = n.Body,
                isRead = n.IsRead,
                metadata = n.Metadata,
                createdAt = n.CreatedAt
            }));
        }

        [HttpPost("mark-read")]
        public async Task<IActionResult> MarkRead([FromBody] Guid[] ids)
        {
            var userId = GetUserIdFromClaims();
            if (userId == Guid.Empty) return Unauthorized();

            await _notifications.MarkReadAsync(userId, ids ?? Array.Empty<Guid>());
            return Ok();
        }

        [HttpPost("mark-all-read")]
        public async Task<IActionResult> MarkAll()
        {
            var userId = GetUserIdFromClaims();
            if (userId == Guid.Empty) return Unauthorized();

            await _notifications.MarkAllReadAsync(userId);
            return Ok();
        }
    }
}
