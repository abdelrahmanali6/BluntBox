using System;

namespace BluntBox.Application.Models
{
    public class MessageCreateDto
    {
        public Guid RecipientUserId { get; set; }
        public string Content { get; set; }
        public bool IsPublic { get; set; }
        public string? SenderIp { get; set; }
        public string? Language { get; set; }
    }
}
