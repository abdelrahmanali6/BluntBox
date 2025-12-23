using System;
using System.Threading.Tasks;

namespace BluntBox.Application.Interfaces
{
    public interface IMessageModerationQueue
    {
        Task EnqueueAsync(Guid messageId, string content);
    }
}
