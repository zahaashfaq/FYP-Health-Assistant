using FitBot.Api.Data;
using FitBot.Api.DTOs;
using FitBot.Api.Models;
using System.Text;
using System.Text.Json;
using FitBot.Api.Models;


namespace FitBot.Api.Services
{
    public class ChatService : IChatService
    {
        private readonly IConfiguration _config;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly AppDbContext _context;
        private readonly ILogger<ChatService> _logger;

        public ChatService(
            IConfiguration config,
            IHttpClientFactory httpClientFactory,
            AppDbContext context,
            ILogger<ChatService> logger)
        {
            _config = config;
            _httpClientFactory = httpClientFactory;
            _context = context;
            _logger = logger;
        }

        // ─────────────────────────────────────────────
        // MAIN ENTRY POINT
        // ─────────────────────────────────────────────
        public async Task<ChatResponseDto> GetAiResponseAsync(
            string message,
            List<ChatHistoryItem> history,
            UserProfile? profile)
        {
            string systemPrompt = BuildSystemPrompt(profile);

            var reply = await CallGeminiApiAsync(message, history, systemPrompt);

            if (reply != null)
            {
                return new ChatResponseDto
                {
                    Reply = reply,
                    Source = "gemini"
                };
            }

            _logger.LogError("Gemini API failed. Check API key.");

            return new ChatResponseDto
            {
                Reply = "I'm having trouble connecting to AI service right now. Please try again later.",
                Source = "error"
            };
        }

        // ─────────────────────────────────────────────
        // GEMINI API CALL
        // ─────────────────────────────────────────────
        private async Task<string?> CallGeminiApiAsync(
            string message,
            List<ChatHistoryItem> history,
            string systemPrompt)
        {
            var apiKey = _config["ApiKeys:Gemini"];
            if (string.IsNullOrWhiteSpace(apiKey))
            {
                _logger.LogWarning("Gemini API key missing.");
                return null;
            }

            try
            {
                var client = _httpClientFactory.CreateClient();
                client.Timeout = TimeSpan.FromSeconds(30);

                var contents = new List<object>();
                bool injected = false;

                foreach (var h in history.TakeLast(10))
                {
                    var role = h.Role == "assistant" ? "model" : "user";

                    var text = h.Content;

                    if (!injected && role == "user")
                    {
                        text = $"{systemPrompt}\n\nUser: {text}";
                        injected = true;
                    }

                    contents.Add(new { role, parts = new[] { new { text } } });
                }

                var finalText = !injected
                    ? $"{systemPrompt}\n\nUser: {message}"
                    : message;

                contents.Add(new
                {
                    role = "user",
                    parts = new[] { new { text = finalText } }
                });

                var body = new
                {
                    contents,
                    generationConfig = new
                    {
                        maxOutputTokens = 2048,
                        temperature = 0.7
                    }
                };

                var url =
                    $"https://generativelanguage.googleapis.com/v1beta/models/" +
                    $"gemini-2.5-flash:generateContent?key={apiKey}";

                var response = await client.PostAsync(
                    url,
                    new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json"));

                var responseText = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError("Gemini error: {Status} {Body}", response.StatusCode, responseText);
                    return null;
                }

                using var json = JsonDocument.Parse(responseText);

                return json.RootElement
                    .GetProperty("candidates")[0]
                    .GetProperty("content")
                    .GetProperty("parts")[0]
                    .GetProperty("text")
                    .GetString();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gemini API exception");
                return null;
            }
        }

        // ─────────────────────────────────────────────
        // SYSTEM PROMPT BUILDER
        // ─────────────────────────────────────────────
        private static string BuildSystemPrompt(UserProfile? profile)
        {
            var sb = new StringBuilder();

            sb.AppendLine("You are FitBot, an AI fitness assistant.");
            sb.AppendLine("Give structured, clear, and actionable fitness advice.");
            sb.AppendLine("Use bullet points, headings, and markdown formatting.");
            sb.AppendLine("Never provide medical diagnosis.");

            if (profile != null)
            {
                sb.AppendLine("\nUSER PROFILE:");
                sb.AppendLine($"Age: {profile.Age}");
                sb.AppendLine($"Gender: {profile.Gender}");
                sb.AppendLine($"Height: {profile.Height} cm");
                sb.AppendLine($"Weight: {profile.Weight} kg");
                sb.AppendLine($"BMI: {profile.BmiValue:F1}");
                sb.AppendLine($"Target Weight: {profile.TargetWeight} kg");

                if (!string.IsNullOrWhiteSpace(profile.HealthIssues))
                {
                    sb.AppendLine($"Health Issues: {profile.HealthIssues}");
                }
            }

            return sb.ToString();
        }

        // ─────────────────────────────────────────────
        // HISTORY
        // ─────────────────────────────────────────────
        public async Task<List<object>> GetHistoryAsync(int userId)
        {
            return await Task.FromResult(
                _context.ChatHistory
                    .Where(x => x.UserId == userId)
                    .OrderByDescending(x => x.Timestamp)
                    .Take(50)
                    .Select(x => (object)new
                    {
                        x.Message,
                        x.IsBot,
                        x.Timestamp
                    })
                    .ToList());
        }
    }
}