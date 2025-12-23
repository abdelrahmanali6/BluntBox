using System;
using System.Threading;
using System.Threading.Tasks;
using BluntBox.Application.Interfaces;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.DependencyInjection;

namespace BluntBox.Application.Services
{
    public class ModerationBackgroundService : BackgroundService
    {
        private readonly IMessageModerationQueue _queue;
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<ModerationBackgroundService> _logger;
        private readonly System.Collections.Concurrent.ConcurrentDictionary<Guid, int> _retryCounts = new System.Collections.Concurrent.ConcurrentDictionary<Guid, int>();

        public ModerationBackgroundService(IMessageModerationQueue queue, IServiceProvider serviceProvider, ILogger<ModerationBackgroundService> logger)
        {
            _queue = queue;
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("ModerationBackgroundService started.");

            var reader = (_queue as MessageModerationQueue)?.Reader;
            if (reader == null)
            {
                _logger.LogError("Moderation queue reader not available.");
                return;
            }

            while (await reader.WaitToReadAsync(stoppingToken))
            {
                while (reader.TryRead(out var item))
                {
                    try
                    {
                        using var scope = _serviceProvider.CreateScope();
                        var db = scope.ServiceProvider.GetRequiredService<BluntBox.Data.BluntBoxDbContext>();
                        var ai = scope.ServiceProvider.GetRequiredService<BluntBox.Application.Interfaces.IAiPromptService>();

                        var message = await db.Messages.FindAsync(new object[] { item.messageId }, cancellationToken: stoppingToken);
                        if (message == null)
                        {
                            _logger.LogWarning("Message {MessageId} not found when processing moderation.", item.messageId);
                            continue;
                        }

                        AiAnalysisResult analysis = null;
                        int attempts = 0;
                        int maxAttempts = 4;
                        int delayMsLocal = 500;
                        while (attempts < maxAttempts && !stoppingToken.IsCancellationRequested)
                        {
                            attempts++;
                            try
                            {
                                analysis = await ai.RenderAndAnalyzeAsync(new { content = item.content }, message?.Language);

                                if (analysis != null && analysis.ModerationStatus != (int)BluntBox.Core.Enums.ModerationStatus.Pending)
                                {
                                    break;
                                }
                            }
                            catch (Exception ex)
                            {
                                _logger.LogWarning(ex, "AI call attempt {Attempt} failed for message {MessageId}", attempts, item.messageId);
                            }

                            try { await Task.Delay(delayMsLocal, stoppingToken); } catch { }
                            delayMsLocal *= 2;
                        }

                        if (analysis != null)
                        {
                            if (analysis.ModerationStatus == (int)BluntBox.Core.Enums.ModerationStatus.Approved)
                            {
                                message.ModerationStatus = BluntBox.Core.Enums.ModerationStatus.Approved;
                            }
                            else if (analysis.ModerationStatus == (int)BluntBox.Core.Enums.ModerationStatus.Blocked)
                            {
                                message.ModerationStatus = BluntBox.Core.Enums.ModerationStatus.Blocked;
                            }

                            message.SentimentScore = analysis.SentimentScore;
                            await db.SaveChangesAsync(stoppingToken);
                            if (message.ModerationStatus == BluntBox.Core.Enums.ModerationStatus.Approved)
                            {
                                try
                                {
                                    var notifier = scope.ServiceProvider.GetService<BluntBox.Application.Interfaces.INotificationService>();
                                    if (notifier != null)
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

                                        await notifier.CreateAsync(n);
                                    }
                                }
                                catch
                                {
                                }
                            }
                        }
                        else
                        {
                            _logger.LogWarning("AI analysis returned null for message {MessageId} after {Attempts} attempts.", item.messageId, attempts);

                            var count = _retryCounts.AddOrUpdate(item.messageId, 1, (_, v) => v + 1);
                            var maxRequeues = 5;
                            if (count <= maxRequeues)
                            {
                                var requeueDelayMs = Math.Min(60000 * count, 300000); // increase delay per requeue, cap 5min
                                _logger.LogInformation("Scheduling requeue for message {MessageId} in {DelayMs}ms (requeue {Count}/{Max}).", item.messageId, requeueDelayMs, count, maxRequeues);
                                _ = Task.Run(async () =>
                                {
                                    try
                                    {
                                        await Task.Delay(requeueDelayMs);
                                        await (_queue as MessageModerationQueue)?.EnqueueAsync(item.messageId, item.content);
                                    }
                                    catch (Exception ex)
                                    {
                                        _logger.LogWarning(ex, "Failed to requeue message {MessageId}", item.messageId);
                                    }
                                });
                            }
                            else
                            {
                                _logger.LogWarning("Giving up requeueing message {MessageId} after {Count} attempts.", item.messageId, count);
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Error processing moderation job.");
                    }
                }
            }
        }
    }
}
