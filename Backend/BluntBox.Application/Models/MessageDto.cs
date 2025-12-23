using System;

namespace BluntBox.Application.Models
{
    public class MessageDto
    {
        public Guid Id { get; set; }
        public Guid RecipientUserId { get; set; }
        public string Content { get; set; }
        public string Language { get; set; }
        public bool IsPublic { get; set; }
        public bool IsReplied { get; set; }
        public DateTime SentAt { get; set; }
        public string? SenderIp { get; set; }
        public int ModerationStatus { get; set; }
        public float? SentimentScore { get; set; }
    }
}
