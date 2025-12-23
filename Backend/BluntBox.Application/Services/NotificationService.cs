using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BluntBox.Application.Interfaces;
using BluntBox.Core.Entities;
using BluntBox.Data;
using Microsoft.EntityFrameworkCore;

namespace BluntBox.Application.Services
{
    public class NotificationService : INotificationService
    {
        private readonly BluntBoxDbContext _db;
        private readonly INotificationPublisher _publisher;

        public NotificationService(BluntBoxDbContext db, INotificationPublisher publisher)
        {
            _db = db;
            _publisher = publisher;
        }

        public async Task<Notification> CreateAsync(Notification n)
        {
            n.Id = Guid.NewGuid();
            n.CreatedAt = DateTime.UtcNow;
            n.IsRead = false;
            _db.Notifications.Add(n);
            await _db.SaveChangesAsync();

            try
            {
                await _publisher.PublishAsync(n);
            }
            catch
            {
            }

            return n;
        }

        public async Task<int> GetUnreadCountAsync(Guid userId)
        {
            return await _db.Notifications.CountAsync(n => n.UserId == userId && !n.IsRead);
        }

        public async Task<IReadOnlyList<Notification>> GetListAsync(Guid userId, int skip = 0, int take = 50)
        {
            var q = await _db.Notifications
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.CreatedAt)
                .Skip(skip)
                .Take(take)
                .ToListAsync();

            return q;
        }

        public async Task MarkReadAsync(Guid userId, Guid[] ids)
        {
            var items = await _db.Notifications.Where(n => n.UserId == userId && ids.Contains(n.Id)).ToListAsync();
            foreach (var i in items) i.IsRead = true;
            await _db.SaveChangesAsync();
        }

        public async Task MarkAllReadAsync(Guid userId)
        {
            var items = await _db.Notifications.Where(n => n.UserId == userId && !n.IsRead).ToListAsync();
            foreach (var i in items) i.IsRead = true;
            await _db.SaveChangesAsync();
        }
    }
}
