using System.Threading.Tasks;
using BluntBox.Application.Interfaces;
using BluntBox.Core.Entities;
using Microsoft.AspNetCore.SignalR;
using System.Text.Json;

namespace BluntBox.Api.SignalR
{
    public class SignalRNotificationPublisher : INotificationPublisher
    {
        private readonly IHubContext<NotificationHub> _hub;

        public SignalRNotificationPublisher(IHubContext<NotificationHub> hub)
        {
            _hub = hub;
        }

        public async Task PublishAsync(Notification notification)
        {
            // Send to a user-specific group named by user id
            var groupName = GetGroupName(notification.UserId);
            var payload = new
            {
                id = notification.Id,
                type = notification.Type,
                referenceId = notification.ReferenceId,
                title = notification.Title,
                body = notification.Body,
                metadata = string.IsNullOrWhiteSpace(notification.Metadata) ? null : JsonSerializer.Deserialize<object>(notification.Metadata),
                createdAt = notification.CreatedAt
            };

            await _hub.Clients.Group(groupName).SendAsync("notification", payload);
        }

        public static string GetGroupName(System.Guid userId) => $"user_{userId:N}";
    }
}
