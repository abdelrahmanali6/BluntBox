using System;

namespace BluntBox.Application.Models
{
    public class ReplyDto
    {
        public Guid Id { get; set; }
        public Guid MessageId { get; set; }
        public Guid ReplierUserId { get; set; }
        public string Content { get; set; }
        public bool IsPublic { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
