using System;
using System.Collections.Generic;
using BluntBox.Core.Enums;

namespace BluntBox.Core.Entities
{
    public class Message
    {
        public Guid Id { get; set; }
        public Guid RecipientUserId { get; set; }
        public string Content { get; set; }
        public string Language { get; set; } = "en";
        public bool IsPublic { get; set; }
        public bool IsReplied { get; set; }
        public DateTime SentAt { get; set; }
        public string? SenderIp { get; set; }
        public ModerationStatus ModerationStatus { get; set; }
        public float? SentimentScore { get; set; }
        public ICollection<Reply> Replies { get; set; } = new List<Reply>();
        public ICollection<MessageAttachment> Attachments { get; set; } = new List<MessageAttachment>();
    }
}
