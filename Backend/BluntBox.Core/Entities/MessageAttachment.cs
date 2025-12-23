using System;

namespace BluntBox.Core.Entities
{
    public class MessageAttachment
    {
        public Guid Id { get; set; }
        public Guid MessageId { get; set; }
        public string BlobUri { get; set; }
        public string FileType { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
