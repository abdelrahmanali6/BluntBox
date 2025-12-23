using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using BluntBox.Application.Models;

namespace BluntBox.Application.Interfaces
{
    public interface IMessageService
    {
        Task<MessageDto> SendMessageAsync(MessageCreateDto dto);
        Task<IReadOnlyList<MessageDto>> GetPublicMessagesAsync(Guid recipientUserId);
        Task<IReadOnlyList<MessageDto>> GetReceivedMessagesAsync(Guid userId);
        Task<MessageWithRepliesDto> GetMessageWithRepliesAsync(Guid messageId);
        Task<MessageWithRepliesDto> AddReplyAsync(Guid messageId, ReplyCreateDto dto, Guid replierUserId);
    }
}
