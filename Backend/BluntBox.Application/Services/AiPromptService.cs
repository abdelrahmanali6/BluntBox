using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using BluntBox.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Scriban;

namespace BluntBox.Application.Services
{
    public class AiPromptService : IAiPromptService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;
        private readonly Microsoft.Extensions.Logging.ILogger<AiPromptService> _logger;

        public AiPromptService(IHttpClientFactory httpClientFactory, IConfiguration configuration, Microsoft.Extensions.Logging.ILogger<AiPromptService> logger)
        {
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<AiAnalysisResult> RenderAndAnalyzeAsync(object model, string? language = null)
        {
            var apiKey = _configuration["Ai:ApiKey"];
            if (string.IsNullOrWhiteSpace(apiKey))
            {
                apiKey = Environment.GetEnvironmentVariable("Ai__ApiKey")
                      ?? Environment.GetEnvironmentVariable("AI_API_KEY")
                      ?? Environment.GetEnvironmentVariable("OPENAI_API_KEY");

                if (string.IsNullOrWhiteSpace(apiKey))
                {
                    try
                    {
                        var tried = new[]
                        {
                            AppContext.BaseDirectory,
                            System.IO.Directory.GetCurrentDirectory(),
                            "/Users/abdelrahmanali/Downloads/BluntBox/BluntBox.Api"
                        };

                        string candidate = null;
                        foreach (var dir in tried)
                        {
                            var c = System.IO.Path.Combine(dir ?? string.Empty, "appsettings.json");
                            if (System.IO.File.Exists(c))
                            {
                                candidate = c;
                                break;
                            }
                        }

                        if (!string.IsNullOrWhiteSpace(candidate) && System.IO.File.Exists(candidate))
                        {
                            using var fs = System.IO.File.OpenRead(candidate);
                            using var doc = JsonDocument.Parse(fs);
                            if (doc.RootElement.TryGetProperty("Ai", out var aiEl) && aiEl.TryGetProperty("ApiKey", out var keyEl))
                            {
                                var k = keyEl.GetString();
                                if (!string.IsNullOrWhiteSpace(k)) apiKey = k;
                            }
                        }
                    }
                    catch
                    {
                    }
                }
            }
            apiKey ??= string.Empty;

            if (string.IsNullOrWhiteSpace(apiKey))
            {
                _logger?.LogWarning("AI API key not found in configuration or environment (Ai:ApiKey or Ai__ApiKey or OPENAI_API_KEY).");
            }
            else
            {
                _logger?.LogInformation("AI API key found (length={Length})", apiKey.Length);
            }
            var templateText = _configuration["Ai:PromptTemplate"] ?? "{\"moderation\":\"Pending\",\"sentiment\":0}";
            try
            {
                if (!string.IsNullOrWhiteSpace(language))
                {
                    var key = $"Ai:PromptTemplate:{language}"; 
                    var alt = _configuration[key];
                    if (!string.IsNullOrWhiteSpace(alt)) templateText = alt;
                }
            }
            catch { }
            var forceApproved = false;
            try
            {
                forceApproved = _configuration.GetValue<bool>("Ai:ForceApproved");
            }
            catch
            {
                forceApproved = false;
            }

            var scribanTemplate = Template.Parse(templateText);
            var rendered = scribanTemplate.Render(model, memberRenamer: member => member.Name);

            if (forceApproved)
            {
                try
                {
                    var analysis = JsonSerializer.Deserialize<AiAnalysisResult>(rendered, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                    if (analysis != null) return analysis;
                }
                catch
                {
                    return new AiAnalysisResult { ModerationStatus = 1, SentimentScore = 0.0f };
                }

                return new AiAnalysisResult { ModerationStatus = 1, SentimentScore = 0.0f };
            }

            var provider = (_configuration["Ai:Provider"] ?? "ollama").ToLowerInvariant();
            var client = _httpClientFactory.CreateClient("OpenAI");
            var baseUrl = _configuration["Ai:BaseUrl"] ?? "http://127.0.0.1:11434";
            var modelName = _configuration["Ai:Model"] ?? "llama3";
            var maxTokens = _configuration.GetValue<int?>("Ai:MaxTokens") ?? 200;

            if (provider == "ollama")
            {

                var payload = new
                {
                    model = modelName,
                    prompt = rendered,
                    max_tokens = maxTokens
                };

                var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
                var url = baseUrl.TrimEnd('/') + "/api/generate";

                var resp = await client.PostAsync(url, content);

                var bodyStream = await resp.Content.ReadAsStreamAsync();

                if (!resp.IsSuccessStatusCode)
                {
                    string body = string.Empty;
                    try { using var sr2 = new System.IO.StreamReader(bodyStream); body = await sr2.ReadToEndAsync(); } catch { }
                    _logger?.LogWarning("Ollama returned non-success status {Status}. Body: {Body}", (int)resp.StatusCode, body);
                    throw new HttpRequestException($"Ollama returned {(int)resp.StatusCode}");
                }

                var sb = new StringBuilder();
                try
                {
                    bodyStream.Position = 0;
                }
                catch {  }

                using (var reader = new System.IO.StreamReader(bodyStream))
                {
                    string? line;
                    while ((line = await reader.ReadLineAsync()) != null)
                    {
                        if (string.IsNullOrWhiteSpace(line)) continue;
                        try
                        {
                            using var doc = JsonDocument.Parse(line);
                            var root = doc.RootElement;
                            if (root.TryGetProperty("response", out var respEl))
                            {
                                var piece = respEl.GetString() ?? string.Empty;
                                sb.Append(piece);
                            }

                            if (root.TryGetProperty("done", out var doneEl) && doneEl.ValueKind == JsonValueKind.True)
                            {
                                break;
                            }
                        }
                        catch
                        {
                        }
                    }
                }

                var text = sb.ToString();
                try
                {
                    var shortText = text.Length > 1000 ? text.Substring(0, 1000) + "..." : text;
                    _logger?.LogInformation("Ollama response text (truncated): {Text}", shortText);
                }
                catch { }
                try
                {
                    var analysis = JsonSerializer.Deserialize<AiAnalysisResult>(text, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                    if (analysis != null) return analysis;
                }
                catch { }

                try
                {
                    var first = text.IndexOf('{');
                    var last = text.LastIndexOf('}');
                    if (first >= 0 && last > first)
                    {
                        var sub = text.Substring(first, last - first + 1);
                        try
                        {
                            var analysis2 = JsonSerializer.Deserialize<AiAnalysisResult>(sub, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                            if (analysis2 != null) return analysis2;
                        }
                        catch { }
                    }
                }
                catch { }

                return new AiAnalysisResult { ModerationStatus = 0, SentimentScore = null };
            }


            // Groq/OpenAI-compatible path: use config values
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

            var oaipayload = new
            {
                model = modelName,
                messages = new[] { new { role = "user", content = rendered } },
                max_tokens = maxTokens
            };

            var oaicontent = new StringContent(JsonSerializer.Serialize(oaipayload), Encoding.UTF8, "application/json");

            var oairesp = await client.PostAsync(baseUrl, oaicontent);
            var oabody = await oairesp.Content.ReadAsStringAsync();

            if (!oairesp.IsSuccessStatusCode)
            {
                _logger?.LogWarning("OpenAI returned non-success status {Status}. Body: {Body}", (int)oairesp.StatusCode, oabody);
                throw new HttpRequestException($"OpenAI returned {(int)oairesp.StatusCode}");
            }

            try
            {
                using var doc = JsonDocument.Parse(oabody);
                if (doc.RootElement.TryGetProperty("choices", out var choices) && choices.GetArrayLength() > 0)
                {
                    var first = choices[0];
                    if (first.TryGetProperty("message", out var message) && message.TryGetProperty("content", out var contentEl))
                    {
                        var text = contentEl.GetString() ?? string.Empty;

                        // Expect AI to return JSON like: { "moderationStatus": 1, "sentimentScore": 0.75 }
                        try
                        {
                            var analysis = JsonSerializer.Deserialize<AiAnalysisResult>(text, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                            if (analysis != null) return analysis;
                        }
                        catch
                        {
                        }
                    }
                }
            }
            catch
            {
            }

            return new AiAnalysisResult { ModerationStatus = 0, SentimentScore = null };
        }
    }
}
