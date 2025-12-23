using System;
using System.Collections.Generic;

namespace BluntBox.Application.Models
{
    public class MessageWithRepliesDto
    {
        public MessageDto Message { get; set; }
        public IReadOnlyList<ReplyDto> Replies { get; set; }
    }
}
