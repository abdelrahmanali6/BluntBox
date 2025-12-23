using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using BluntBox.Core.Entities;

namespace BluntBox.Application.Interfaces
{
    public interface INotificationService
    {
        Task<Notification> CreateAsync(Notification n);
        Task<int> GetUnreadCountAsync(Guid userId);
        Task<IReadOnlyList<Notification>> GetListAsync(Guid userId, int skip = 0, int take = 50);
        Task MarkReadAsync(Guid userId, Guid[] ids);
        Task MarkAllReadAsync(Guid userId);
    }
}
