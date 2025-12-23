using System.Threading.Tasks;
using BluntBox.Core.Entities;

namespace BluntBox.Application.Interfaces
{
    public interface INotificationPublisher
    {
        Task PublishAsync(Notification notification);
    }
}
