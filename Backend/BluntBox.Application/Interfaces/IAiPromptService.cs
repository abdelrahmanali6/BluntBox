using System.Threading.Tasks;

namespace BluntBox.Application.Interfaces
{
    public class AiAnalysisResult
    {
        public int ModerationStatus { get; set; }
        public float? SentimentScore { get; set; }
    }

    public interface IAiPromptService
    {
        Task<AiAnalysisResult> RenderAndAnalyzeAsync(object model, string? language = null);
    }
}
