using System;
using System.Threading.Channels;
using System.Threading.Tasks;
using BluntBox.Application.Interfaces;

namespace BluntBox.Application.Services
{
    public class MessageModerationQueue : IMessageModerationQueue
    {
        private readonly Channel<(Guid messageId, string content)> _channel;

        public MessageModerationQueue()
        {
            _channel = Channel.CreateUnbounded<(Guid, string)>();
        }

        public ChannelReader<(Guid messageId, string content)> Reader => _channel.Reader;

        public async Task EnqueueAsync(Guid messageId, string content)
        {
            if (messageId == Guid.Empty) throw new ArgumentException("messageId");
            await _channel.Writer.WriteAsync((messageId, content));
        }
    }
}
