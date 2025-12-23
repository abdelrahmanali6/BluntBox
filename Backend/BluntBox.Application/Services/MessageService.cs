using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BluntBox.Application.Interfaces;
using BluntBox.Application.Models;
using BluntBox.Core.Entities;
using BluntBox.Core.Enums;
using BluntBox.Data;
using Microsoft.EntityFrameworkCore;

namespace BluntBox.Application.Services
{
    public class MessageService : IMessageService
    {
        private readonly BluntBoxDbContext _db;
        private readonly IAiPromptService _ai;
        private readonly IMessageModerationQueue _moderationQueue;
        private readonly BluntBox.Application.Interfaces.INotificationService _notificationService;

        public MessageService(BluntBoxDbContext db, IAiPromptService ai, IMessageModerationQueue moderationQueue, BluntBox.Application.Interfaces.INotificationService notificationService)
        {
            _db = db;
            _ai = ai;
            _moderationQueue = moderationQueue;
            _notificationService = notificationService;
        }

        public async Task<MessageDto> SendMessageAsync(MessageCreateDto dto)
        {
            var message = new Message
            {
                Id = Guid.NewGuid(),
                RecipientUserId = dto.RecipientUserId,
                Content = dto.Content,
                Language = string.IsNullOrWhiteSpace(dto.Language) ? "en" : dto.Language,
                IsPublic = dto.IsPublic,
                IsReplied = false,
                SentAt = DateTime.UtcNow,
                SenderIp = dto.SenderIp,
                ModerationStatus = ModerationStatus.Pending,
            };

            var model = new { content = message.Content };

            AiAnalysisResult analysis = null;
            int attempts = 0;
            int maxAttempts = 3;
            int delayMs = 400;
            while (attempts < maxAttempts)
            {
                attempts++;
                try
                {
                    analysis = await _ai.RenderAndAnalyzeAsync(model, message.Language);
                    if (analysis != null && analysis.ModerationStatus != (int)Core.Enums.ModerationStatus.Pending)
                    {
                        break;
                    }
                }
                catch
                {
                }

                try { await Task.Delay(delayMs); } catch { }
                delayMs *= 2;
            }

            if (analysis != null)
            {
                if (analysis.ModerationStatus == (int)Core.Enums.ModerationStatus.Approved)
                {
                    message.ModerationStatus = Core.Enums.ModerationStatus.Approved;
                }
                else if (analysis.ModerationStatus == (int)Core.Enums.ModerationStatus.Blocked)
                {
                    message.ModerationStatus = Core.Enums.ModerationStatus.Blocked;
                }

                message.SentimentScore = analysis.SentimentScore;
            }

            if (message.ModerationStatus == Core.Enums.ModerationStatus.Approved)
            {
                try
                {
                    var n = new BluntBox.Core.Entities.Notification
                    {
                        UserId = message.RecipientUserId,
                        Type = "message_approved",
                        ReferenceId = message.Id,
                        Title = "New approved message",
                        Body = message.IsPublic ? "A public message was approved" : "A private message was approved",
                        Metadata = System.Text.Json.JsonSerializer.Serialize(new { preview = (message.Content?.Length > 120 ? message.Content.Substring(0, 120) + "..." : message.Content), isPublic = message.IsPublic })
                    };

                    try
                    {
                        await _notificationService.CreateAsync(n);
                    }
                    catch
                    {
                    }
                }
                catch
                {
                }
            }

            _db.Messages.Add(message);
            await _db.SaveChangesAsync();

            try
            {
                await _moderationQueue.EnqueueAsync(message.Id, message.Content);
            }
            catch
            {
            }

            return new MessageDto
            {
                Id = message.Id,
                RecipientUserId = message.RecipientUserId,
                Content = message.Content,
                Language = message.Language,
                IsPublic = message.IsPublic,
                IsReplied = message.IsReplied,
                SentAt = message.SentAt,
                SenderIp = message.SenderIp,
                ModerationStatus = (int)message.ModerationStatus,
                SentimentScore = message.SentimentScore
            };
        }

        public async Task<IReadOnlyList<MessageDto>> GetPublicMessagesAsync(Guid recipientUserId)
        {
            var q = await _db.Messages
                .Where(m => m.RecipientUserId == recipientUserId && m.IsPublic && m.ModerationStatus == ModerationStatus.Approved)
                .OrderByDescending(m => m.SentAt)
                .Select(m => new MessageDto
                {
                    Id = m.Id,
                    RecipientUserId = m.RecipientUserId,
                    Content = m.Content,
                    Language = m.Language,
                    IsPublic = m.IsPublic,
                    IsReplied = m.IsReplied,
                    SentAt = m.SentAt,
                    SenderIp = m.SenderIp,
                    ModerationStatus = (int)m.ModerationStatus,
                    SentimentScore = m.SentimentScore
                }).ToListAsync();

            return q;
        }

        public async Task<IReadOnlyList<MessageDto>> GetReceivedMessagesAsync(Guid userId)
        {
            var list = await _db.Messages
                .Where(m => m.RecipientUserId == userId && m.ModerationStatus == ModerationStatus.Approved)
                .OrderByDescending(m => m.SentAt)
                .Select(m => new MessageDto
                {
                    Id = m.Id,
                    RecipientUserId = m.RecipientUserId,
                    Content = m.Content,
                    Language = m.Language,
                    IsPublic = m.IsPublic,
                    IsReplied = m.IsReplied,
                    SentAt = m.SentAt,
                    SenderIp = m.SenderIp,
                    ModerationStatus = (int)m.ModerationStatus,
                    SentimentScore = m.SentimentScore
                }).ToListAsync();

            return list;
        }

        public async Task<MessageWithRepliesDto> GetMessageWithRepliesAsync(Guid messageId)
        {
            var message = await _db.Messages
                .Where(m => m.Id == messageId && m.ModerationStatus == ModerationStatus.Approved)
                .Select(m => new MessageDto
                {
                    Id = m.Id,
                    RecipientUserId = m.RecipientUserId,
                    Content = m.Content,
                    Language = m.Language,
                    IsPublic = m.IsPublic,
                    IsReplied = m.IsReplied,
                    SentAt = m.SentAt,
                    SenderIp = m.SenderIp,
                    ModerationStatus = (int)m.ModerationStatus,
                    SentimentScore = m.SentimentScore
                }).SingleOrDefaultAsync();

            if (message == null) return null;

            var replies = await _db.Replies
                .Where(r => r.MessageId == messageId && r.IsPublic)
                .OrderBy(r => r.CreatedAt)
                .Select(r => new ReplyDto
                {
                    Id = r.Id,
                    MessageId = r.MessageId,
                    ReplierUserId = r.ReplierUserId,
                    Content = r.Content,
                    IsPublic = r.IsPublic,
                    CreatedAt = r.CreatedAt
                }).ToListAsync();

            return new MessageWithRepliesDto
            {
                Message = message,
                Replies = replies
            };
        }

        public async Task<MessageWithRepliesDto> AddReplyAsync(Guid messageId, ReplyCreateDto dto, Guid replierUserId)
        {
            if (messageId == Guid.Empty) return null;

            var message = await _db.Messages.SingleOrDefaultAsync(m => m.Id == messageId);
            if (message == null) return null;

            var reply = new Core.Entities.Reply
            {
                Id = Guid.NewGuid(),
                MessageId = messageId,
                ReplierUserId = replierUserId,
                Content = dto.Content,
                IsPublic = false,
                CreatedAt = DateTime.UtcNow
            };

            var model = new { content = reply.Content };
            try
            {
                var analysis = await _ai.RenderAndAnalyzeAsync(model, message.Language);
                if (analysis != null && analysis.ModerationStatus == (int)Core.Enums.ModerationStatus.Approved)
                {
                    reply.IsPublic = dto.IsPublic;
                }
            }
            catch
            {
            }

            _db.Replies.Add(reply);
            message.IsReplied = true;
            await _db.SaveChangesAsync();

            return await GetMessageWithRepliesAsync(messageId);
        }
    }
}
