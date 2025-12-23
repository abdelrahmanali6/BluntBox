using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace BluntBox.Api.SignalR
{
    [Authorize]
    public class NotificationHub : Hub
    {
        public override async Task OnConnectedAsync()
        {
            var sub = Context.User?.FindFirst("sub")?.Value ?? Context.User?.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (Guid.TryParse(sub, out var userId))
            {
                var group = SignalR.SignalRNotificationPublisher.GetGroupName(userId);
                await Groups.AddToGroupAsync(Context.ConnectionId, group);
            }

            await base.OnConnectedAsync();
        }
    }
}
